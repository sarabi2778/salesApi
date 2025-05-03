module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');
    return sequelize.define('Customer', {
      customerId: DataTypes.STRING,
      customerName: DataTypes.STRING,
      customerEmail: DataTypes.STRING,
      customerAddress: DataTypes.STRING
    });
  };