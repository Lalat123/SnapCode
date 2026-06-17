const express = require('express');
const { executeCode } = require('../executor');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const submissionsDB = {};

router.post('/', async (req, res) => {
  try {
    const { language, code, customInput } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const jobId = uuidv4();
    
    submissionsDB[jobId] = {
      id: jobId,
      status: 'Pending',
      language,
      submittedAt: new Date()
    };

    // Return the jobId immediately so the frontend can start polling
    res.status(201).json({ jobId, message: 'Submission received' });

    // Execute asynchronously (mocking the queue worker behavior locally)
    setTimeout(async () => {
      try {
        const result = await executeCode(language, code, customInput);
        submissionsDB[jobId].status = 'Completed';
        submissionsDB[jobId].result = result;
      } catch (err) {
        submissionsDB[jobId].status = 'Failed';
        submissionsDB[jobId].error = err.message;
      }
    }, 100);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:jobId', (req, res) => {
  const { jobId } = req.params;
  const submission = submissionsDB[jobId];
  
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  res.json(submission);
});

module.exports = router;
