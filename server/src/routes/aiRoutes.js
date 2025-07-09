const express = require('express');
const { getSkillSuggestions } = require('../controllers/aiController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/suggest-skills', authenticateJWT, getSkillSuggestions);

module.exports = router;
