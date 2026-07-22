/**
 * Clear orders and users from the database
 * Usage: node api/clear-data.js
 */
require('dotenv').config({ path: '.env.local' });
const Order = require('./models/Order');
const User = require('./models/User');
const { connectDB, disconnectDB } = require('./config/mongodb');

async function clearData() {
  try {
    await connectDB();

    const orderResult = await Order.deleteMany({});
    console.log(`✓ Cleared ${orderResult.deletedCount} orders`);

    const userResult = await User.deleteMany({});
    console.log(`✓ Cleared ${userResult.deletedCount} users`);

    await disconnectDB();
    console.log('✓ Database reset to clean state');
  } catch (error) {
    console.error('✗ Failed:', error.message);
    process.exit(1);
  }
}

clearData();
