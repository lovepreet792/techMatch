const axios = require('axios');
const Job = require('../models/job.model');
const UserJob = require('../models/userjob.model');
const User = require('../models/user.model');

// exports.matchJobs = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findByPk(userId);

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const techStack = user.techStack?.split(',').map(t => t.trim().toLowerCase()) || [];
//     console.log(`Matching jobs for user ${userId} with tech stack:`, techStack);
    

//     // 1. Fetch jobs from Remotive API
//     const response = await axios.get('https://remotive.io/api/remote-jobs');
//     console.log(`Fetched ${response.data.jobs.length} jobs from Remotive API`);
    
//     const jobs = response.data.jobs;
//     console.log(`Total jobs fetched: ${jobs.length}`);
    

//     // 2. Filter jobs that match user's tech stack
//     const matched = jobs.map(job => {
//       const jobSkills = (job.description + ' ' + job.title).toLowerCase();
//       const matchedSkills = techStack.filter(skill => jobSkills.includes(skill));
//       const matchPercentage = Math.floor((matchedSkills.length / techStack.length) * 100);

//       return {
//         id: job.id,
//         title: job.title,
//         company: job.company_name,
//         location: job.candidate_required_location,
//         url: job.url,
//         description: job.description,
//         matchedSkills,
//         matchPercentage
//       };
//     });

//     // 3. Sort by match %
//     const sortedJobs = matched.sort((a, b) => b.matchPercentage - a.matchPercentage);

//     res.json(sortedJobs.slice(0, 20)); // Return top 20 matches

//   } catch (err) {
//     console.error('Job match error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch and match jobs' });
//   }
// };

exports.matchJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const techStack = user.techStack?.split(',').map(t => t.trim().toLowerCase()) || [];
    const searchQuery = techStack.slice(0, 3).join(' '); // Join first 3 skills to use as search term

    console.log(`Searching for jobs related to: "${searchQuery}"`);

    // 🔁 Fetch jobs from JSearch API
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: searchQuery,
        page: 1,
        num_pages: 1,
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    const jobs = response.data.data || [];

    const matched = jobs.map(job => {
      const jobText = (job.job_description + ' ' + job.job_title).toLowerCase();
      const matchedSkills = techStack.filter(skill => jobText.includes(skill));
      const matchPercentage = Math.floor((matchedSkills.length / techStack.length) * 100);

      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || job.job_country,
        url: job.job_apply_link,
        description: job.job_description,
        matchedSkills,
        matchPercentage,
      };
    });

    const sortedJobs = matched.sort((a, b) => b.matchPercentage - a.matchPercentage);
    res.json(sortedJobs.slice(0, 20));

  } catch (err) {
    console.error('Job match error:', err.message);
    res.status(500).json({ error: 'Failed to fetch and match jobs' });
  }
};



// 🟢 POST /api/jobs/:id/save
exports.saveJob = async (req, res) => {
  const userId = req.user.id;
  console.log(`Saving job for user ${userId}`);
  
  const jobId = req.params.id;
  console.log(`Job ID to save: ${jobId}`);
  console.log(`Request body:`, req.body);
  
  
  const { title, company, location, url, description } = req.body;

  try {
    // First, insert the job into the DB if not already present
    const [job, created] = await Job.findOrCreate({
      where: { id: jobId },
      defaults: { title, company, location, url, description }
    });

    // Now save job for this user
    await SavedJob.findOrCreate({
      where: { userId, jobId }
    });

    res.json({
      message: 'Job saved successfully!',
      jobId,
      jobStored: created
    });
  } catch (error) {
    console.error('❌ Error saving job:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
};

// 🟢 POST /api/jobs/:id/apply
exports.applyJob = async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findOne({ where: { jobId } });
  if (!job) return res.status(404).json({ error: 'Job not found in database' });

  await UserJob.create({ userId: req.user.id, jobId: job.id, status: 'applied' });
  res.json({ message: 'Job applied successfully' });
};

// 🟢 GET /api/user/saved-jobs
exports.getSavedJobs = async (req, res) => {
  const saved = await UserJob.findAll({
    where: { userId: req.user.id, status: 'saved' },
    include: ['job']
  });
  res.json(saved);
};