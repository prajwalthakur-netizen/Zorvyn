const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { getSummary, getTrends } = require('../controllers/analyticsController');

router.get('/summary', auth, roleGuard('analyst', 'admin'), getSummary);
router.get('/trends',  auth, roleGuard('analyst', 'admin'), getTrends);

module.exports = router;