// const pdfParse = require('pdf-parse');
// const User = require('../models/user.model');
// const fs = require('fs');

// const knownSkills = ['React', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'JavaScript', 'TypeScript', 'Tailwind', 'Redux'];

// exports.uploadResume = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const dataBuffer = fs.readFileSync(req.file.path);
//   const pdfData = await pdfParse(dataBuffer);

//   const text = pdfData.text;
//   const extractedSkills = knownSkills.filter((skill) =>
//     text.toLowerCase().includes(skill.toLowerCase())
//   );

//   const userId = req.user?.id;
//   const user = await User.findByPk(userId);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   user.set({ techStack: extractedSkills.join(', ') });
//   await user.save();

//   fs.unlinkSync(req.file.path); // clean temp file

//   res.json({
//     message: 'Resume uploaded and skills updated',
//     extractedSkills,
//   });
// };


// const pdfParse = require('pdf-parse');
// const fs = require('fs');
// const path = require('path');
// const Suggestion = require('../models/suggestion.model');

// exports.uploadResume = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: 'No file uploaded' });

//     const pdfPath = path.join(__dirname, '..', '..', 'uploads', file.filename);
//     const dataBuffer = fs.readFileSync(pdfPath);
//     const parsed = await pdfParse(dataBuffer);
//     const resumeText = parsed.text;

//     const prompt = `
// You are a career coach AI.
// Here is a resume:
// """
// ${resumeText}
// """

// Based on this resume:
// 1. Suggest missing technical skills.
// 2. Recommend 2–3 real-world project ideas.
// 3. Point out weak or outdated areas.
// Respond in bullet points.
// `;

//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ model: 'llama3', prompt, stream: false })
//     });

//     const data = await response.json();
//     const suggestionText = data.response;

//     await Suggestion.create({
//       userId: req.user.id,
//       suggestionText
//     });

//     res.json({ suggestions: suggestionText });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Resume analysis failed' });
//   }
// };







// server/src/controllers/resumeController.js

const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');
const { getSkillSuggestions } = require('./aiController');
const { extractTechStack, extractExperience } = require('../utils/resumeUtils');


exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const filePath = req.file.path;

    const user = await User.findByPk(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. Save resume file
    user.resumePath = filePath;

    // 2. Parse resume content
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    const text = parsed.text;

    // 3. Extract tech stack & experience
    const techs = extractTechStack(text);
    const experience = extractExperience(text);

    user.techStack = techs.join(', ');

    await user.save();

    // 4. Get AI-based suggestions
    const aiSuggestions = await getSkillSuggestions(techs.join(', '));

    // Optional: Save to DB as suggestion history

    res.status(200).json({
      message: 'Resume uploaded and analyzed',
      extracted: { techs, experience },
      suggestions: aiSuggestions,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};


exports.viewResume = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.resumePath) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const fullPath = path.resolve(user.resumePath);
    res.sendFile(fullPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve resume' });
  }
};
