const { Worker } = require('bullmq');
const { redisConnection } = require('./queue/submissionQueue');
const { executeCode } = require('./executor');

console.log('Worker started. Listening for submissions...');

const worker = new Worker('submissions', async (job) => {
  console.log(`Processing job ${job.id}`);
  const { language, code, testCases } = job.data;
  
  try {
    const result = await executeCode(language, code, testCases);
    return result;
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error;
  }
}, { connection: redisConnection });

worker.on('completed', (job, returnvalue) => {
  console.log(`Job ${job.id} completed with result:`, returnvalue);
});

worker.on('failed', (job, error) => {
  console.log(`Job ${job.id} failed with error:`, error.message);
});
