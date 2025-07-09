const express = require('express');
const router = express.Router();
const jobCtrl = require('../controllers/jobController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/live-match', authenticateJWT, jobCtrl.matchJobs);
router.post('/:id/save', authenticateJWT, jobCtrl.saveJob);
router.post('/:id/apply', authenticateJWT, jobCtrl.applyJob);
router.get('/user/saved-jobs', authenticateJWT, jobCtrl.getSavedJobs);

module.exports = router;