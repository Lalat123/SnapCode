const express = require('express');
const cors = require('cors');
const submissionRoutes = require('./routes/submissions');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/submissions', submissionRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini-Judge Backend is running in Local Mode' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
