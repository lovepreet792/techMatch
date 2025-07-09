const axios = require('axios');
const User = require('../models/user.model');

// Unified fetch function from multiple APIs
exports.aggregateLiveJobs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const userTechStack = user.techStack?.split(',').map(s => s.trim().toLowerCase()) || [];

    const allJobs = [];

    // 🔗 Remotive
    const remotive = await axios.get('https://remotive.io/api/remote-jobs');
    remotive.data.jobs.forEach(job => {
      allJobs.push({
        source: 'Remotive',
        jobId: job.id,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location,
        description: job.description,
        applyUrl: job.url,
        tags: job.tags.map(tag => tag.toLowerCase())
      });
    });

    // 🔗 RemoteOK
    const remoteok = await axios.get('https://remoteok.com/api');
    remoteok.data.filter(j => j.position).forEach(job => {
      allJobs.push({
        source: 'RemoteOK',
        jobId: job.id,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description,
        applyUrl: job.url,
        tags: job.tags?.map(tag => tag.toLowerCase()) || []
      });
    });

    // 🔗 JSearch (RapidAPI)
    const jsearch = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { query: 'developer', page: 1, num_pages: 1 },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });
    jsearch.data.data.forEach(job => {
      allJobs.push({
        source: 'JSearch',
        jobId: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || 'Remote',
        description: job.job_description,
        applyUrl: job.job_apply_link,
        tags: [job.job_title.toLowerCase()]
      });
    });

    // 🔗 Dev.to RSS feed (mocked via external RSS to JSON API)
    const devto = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://dev.to/jobs/feed');
    devto.data.items.forEach(job => {
      allJobs.push({
        source: 'Dev.to',
        jobId: job.guid,
        title: job.title,
        company: 'Dev.to Company',
        location: 'Remote',
        description: job.description,
        applyUrl: job.link,
        tags: []
      });
    });

    // Match by tech stack
    const matchedJobs = allJobs.map(job => {
      const matchedSkills = job.tags.filter(tag => userTechStack.includes(tag));
      const matchPercentage = job.tags.length > 0
        ? Math.floor((matchedSkills.length / job.tags.length) * 100)
        : 0;

      return {
        ...job,
        matchPercentage
      };
    });

    const topMatches = matchedJobs
      .filter(j => j.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 30);

    res.json(topMatches);
  } catch (error) {
    console.error('Aggregator error:', error);
    res.status(500).json({ error: 'Failed to aggregate jobs' });
  }
};
