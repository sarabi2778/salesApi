const express = require('express');
const router = express.Router();
const { revenueController } = require('../controllers/revenue');

// POST /api/revenue
// Body: { startDate, endDate, type: 'byProduct' | 'byCategory' | 'byRegion' | 'trend', interval: 'monthly' | 'quarterly' | 'yearly' }
router.post('/', revenueController);

module.exports = router;
