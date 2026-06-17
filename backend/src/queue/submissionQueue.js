const { Queue } = require('bullmq');

// Connection to Redis
const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Create a queue for code submissions
const submissionQueue = new Queue('submissions', {
  connection: redisConnection
});

const addSubmissionToQueue = async (submissionData) => {
  // Add a job to the queue
  const job = await submissionQueue.add('executeCode', submissionData, {
    removeOnComplete: false,
    removeOnFail: false
  });
  return job;
};

module.exports = {
  submissionQueue,
  addSubmissionToQueue,
  redisConnection
};
