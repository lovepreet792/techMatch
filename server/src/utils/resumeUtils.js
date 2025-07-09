// server/src/utils/resumeUtils.js

function extractTechStack(text) {
  const knownSkills = [
    'React', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL',
    'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
    'Redux', 'Next.js', 'Python', 'Django', 'Flask', 'Git', 'Docker',
    'AWS', 'Firebase', 'Vercel', 'Render', 'Jest', 'Mocha', 'Chai',
    'GraphQL', 'REST API'
  ];

  const found = [];

  knownSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i'); // match full word, case-insensitive
    if (regex.test(text)) {
      found.push(skill);
    }
  });

  return found;
}

function extractExperience(text) {
  const yearRegex = /(\d+)\+?\s+(years|yrs)\s+(of)?\s*(experience)?/gi;
  const jobTitleRegex = /(Intern|Junior|Software Engineer|Developer|Lead|Senior|Manager|CTO)/gi;

  let experienceYears = 0;
  let titles = new Set();

  // Years of experience
  let yearMatches = text.matchAll(yearRegex);
  for (const match of yearMatches) {
    const years = parseInt(match[1]);
    if (!isNaN(years) && years > experienceYears) {
      experienceYears = years;
    }
  }

  // Job titles
  const titleMatches = text.match(jobTitleRegex);
  if (titleMatches) {
    titleMatches.forEach(title => titles.add(title));
  }

  return {
    experienceYears,
    jobTitles: Array.from(titles)
  };
}

module.exports = {
  extractTechStack,
  extractExperience
};
