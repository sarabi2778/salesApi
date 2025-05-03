module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');
    return sequelize.define('Product', {
      productId: DataTypes.STRING,
      productName: DataTypes.STRING,
      category: DataTypes.STRING
    });
  };