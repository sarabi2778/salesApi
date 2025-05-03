const fs = require('fs');
const csv = require('csv-parser');
const { Product, Customer, Order } = require('../models');
const { logRefresh } = require('../refreshLogger');

async function refreshData(filePath = 'data.csv') {
  try {
    logRefresh('Refresh started');

    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Customer.destroy({ where: {} });

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            const [product] = await Product.findOrCreate({
              where: { productId: row['Product ID'] },
              defaults: {
                productName: row['Product Name'],
                category: row['Category']
              }
            });

            const [customer] = await Customer.findOrCreate({
              where: { customerId: row['Customer ID'] },
              defaults: {
                customerName: row['Customer Name'],
                customerEmail: row['Customer Email'],
                customerAddress: row['Customer Address']
              }
            });

            await Order.create({
              dateOfSale: row['Date of Sale'],
              quantitySold: parseInt(row['Quantity Sold']),
              unitPrice: parseFloat(row['Unit Price']),
              discount: parseFloat(row['Discount']),
              shippingCost: parseFloat(row['Shipping Cost']),
              region: row['Region'],
              paymentMethod: row['Payment Method'],
              ProductId: product.id,
              CustomerId: customer.id
            });
          } catch (err) {
            logRefresh('Error processing row: ' + err.message);
          }
        })
        .on('end', () => {
          logRefresh('Refresh completed');
          resolve();
        })
        .on('error', (err) => {
          logRefresh('Error during refresh: ' + err.message);
          reject(err);
        });
    });
  } catch (err) {
    logRefresh('Critical error: ' + err.message);
    throw err;
  }
}

module.exports = { refreshData };
