const { Order, Product } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const calculateRevenue = (orders) => {
  return orders.reduce((acc, o) => {
    const gross = o.quantitySold * o.unitPrice;
    const discount = gross * o.discount;
    return acc + (gross - discount + o.shippingCost);
  }, 0);
};

exports.revenueController = async (req, res) => {
  try {
    const { startDate, endDate, type, interval } = req.body;

    const whereClause = {
      dateOfSale: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (type === 'byProduct') {
      const results = await Order.findAll({
        where: whereClause,
        include: [{ model: Product }],
        attributes: [
          [col('Product.productName'), 'productName'],
          [fn('SUM', literal('(quantitySold * unitPrice - quantitySold * unitPrice * discount + shippingCost)')), 'revenue']
        ],
        group: ['Product.productName']
      });
      return res.json(results);

    } else if (type === 'byCategory') {
      const results = await Order.findAll({
        where: whereClause,
        include: [{ model: Product }],
        attributes: [
          [col('Product.category'), 'category'],
          [fn('SUM', literal('(quantitySold * unitPrice - quantitySold * unitPrice * discount + shippingCost)')), 'revenue']
        ],
        group: ['Product.category']
      });
      return res.json(results);

    } else if (type === 'byRegion') {
      const results = await Order.findAll({
        where: whereClause,
        attributes: [
          'region',
          [fn('SUM', literal('(quantitySold * unitPrice - quantitySold * unitPrice * discount + shippingCost)')), 'revenue']
        ],
        group: ['region']
      });
      return res.json(results);

    } else if (type === 'trend') {
      let timeFormat;
      if (interval === 'monthly') timeFormat = '%Y-%m';
      else if (interval === 'quarterly') timeFormat = 'Q' + fn('CEIL', fn('EXTRACT', literal('MONTH FROM "dateOfSale"')) / 3);
      else timeFormat = '%Y'; // yearly

      const results = await Order.findAll({
        where: whereClause,
        attributes: [
          [fn('to_char', col('dateOfSale'), timeFormat), 'period'],
          [fn('SUM', literal('(quantitySold * unitPrice - quantitySold * unitPrice * discount + shippingCost)')), 'revenue']
        ],
        group: ['period'],
        order: [['period', 'ASC']]
      });
      return res.json(results);

    } else {
      // Default: Total revenue
      const orders = await Order.findAll({ where: whereClause });
      const totalRevenue = calculateRevenue(orders);
      return res.json({ totalRevenue });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
