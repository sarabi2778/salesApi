const cron = require('node-cron');
const { refreshData } = require('../scripts/loadCSV');

// Run at midnight every day
cron.schedule('0 0 * * *', async () => {
  try {
    await refreshData();
  } catch (err) {
    console.error('Scheduled refresh failed:', err.message);
  }
});
