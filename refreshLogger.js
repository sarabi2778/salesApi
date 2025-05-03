const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'refresh.log');

function logRefresh(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
}

module.exports = { logRefresh };
