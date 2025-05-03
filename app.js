const express = require('express');
const bodyParser = require('body-parser');
const revenueRoutes = require('./routes/revenue');
const refreshRoutes = require('./routes/refresh');
const { sequelize } = require('./models');
require('./cron/refreshJob');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/revenue', revenueRoutes);
app.use('/api/refresh', refreshRoutes);


  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
