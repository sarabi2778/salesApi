module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');
    return sequelize.define('Order', {
      dateOfSale: DataTypes.DATEONLY,
      quantitySold: DataTypes.INTEGER,
      unitPrice: DataTypes.FLOAT,
      discount: DataTypes.FLOAT,
      shippingCost: DataTypes.FLOAT,
      region: DataTypes.STRING,
      paymentMethod: DataTypes.STRING
    });
  };
  