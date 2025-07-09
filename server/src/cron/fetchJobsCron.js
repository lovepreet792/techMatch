const cron = require('node-cron');
const axios = require('axios');
const Job = require('../models/job.model');

// Runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Fetching background job listings...');
  try {
    const { data } = await axios.get('https://remotive.io/api/remote-jobs');
    const jobs = data.jobs.slice(0, 20); // Limit to top 20

    for (let job of jobs) {
      await Job.findOrCreate({
        where: { jobId: job.id },
        defaults: {
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location,
          description: job.description,
          applyUrl: job.url,
          skillsRequired: job.tags.join(', '),
        },
      });
    }
    console.log('[CRON] Job sync complete.');
  } catch (err) {
    console.error('[CRON] Failed to sync jobs:', err);
  }
});