const { Sequelize } = require('sequelize');
const config = require('../config/db');

// Proper initialization
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

// Load models
const Order = require('./order')(sequelize);
const Product = require('./product')(sequelize);
const Customer = require('./customer')(sequelize);

// Define associations
Order.belongsTo(Product);
Order.belongsTo(Customer);

// Export everything correctly
module.exports = {
  sequelize,
  Order,
  Product,
  Customer
};
