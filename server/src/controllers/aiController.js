// const { OpenAI } = require('openai');
// const User = require('../models/user.model');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// exports.suggestSkills = async (req, res) => {
//   const userId = req.user.id;
//   const user = await User.findByPk(userId);
//   if (!user) return res.status(404).json({ error: 'User not found' });

//   const userSkills = user.techStack;

//   const prompt = `
// You are a career advisor. A student has these skills: ${userSkills}.
// Suggest improvements or missing skills to help them qualify for modern web developer jobs.
// Respond in bullet points.
// `;

//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: 'user', content: prompt }],
//       model: 'gpt-3.5-turbo',
//     });

//     const suggestions = completion.choices[0].message.content;
//     res.json({ suggestions });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'AI suggestion failed' });
//   }
// };



// Inside aiController.js
export const getSkillSuggestions = async (techStack) => {
  const prompt = `
You are a job advisor. The user knows these technologies: ${techStack}.
What skills should they add to qualify for modern web dev roles?
List bullet points of suggestions.
`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response;

  } catch (err) {
    console.error('AI Suggestion Error:', err);
    return null;
  }
};
