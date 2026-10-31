const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);

module.exports = router;
