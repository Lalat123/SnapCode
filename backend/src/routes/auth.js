const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'users.json');

// Helper to get users from the local JSON file
async function getUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper to save users to the local JSON file
async function saveUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
}

const defaultTemplates = {
  python: '# cook your dish here\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}\n',
  java: 'import java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass Main {\n    public static void main(String[] args) throws java.lang.Exception {\n        // your code goes here\n    }\n}\n',
  javascript: '// your code goes here\n'
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const users = await getUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Add new user
    const newUser = { username, email, password, templates: defaultTemplates };
    users.push(newUser);
    await saveUsers(users);

    return res.status(201).json({ message: 'Account created successfully!', user: { username, email } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = await getUsers();

    // Verify user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({ message: 'Login successful!', user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get User Templates
router.get('/templates', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    return res.status(200).json({ templates: user.templates || defaultTemplates });
  } catch (error) {
    console.error('Fetch Templates Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save User Templates
router.post('/templates', async (req, res) => {
  try {
    const { email, templates } = req.body;
    if (!email || !templates) return res.status(400).json({ error: 'Email and templates are required' });

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].templates = templates;
    await saveUsers(users);

    return res.status(200).json({ message: 'Templates saved successfully' });
  } catch (error) {
    console.error('Save Templates Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
