// server/src/routes/resumeRoutes.js

const express = require('express');
const { uploadResume, viewResume } = require('../controllers/resumeController');
const upload = require('../middleware/upload');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload-resume', authenticateJWT, upload.single('resume'), uploadResume);
router.get('/view-resume', authenticateJWT, viewResume);

module.exports = router;
