const express = require('express');
const router = express.Router();
const { refreshData } = require('../scripts/loadCSV');

router.post('/', async (req, res) => {
  try {
    await refreshData();
    res.json({ message: 'Data refresh completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;