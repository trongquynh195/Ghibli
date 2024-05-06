const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
  try {
    // Remove deprecated options (for driver version >= 4.0.0)
    await mongoose.connect(process.env.MOONGOOSE_URL);
    console.log('Connected successfully!');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

module.exports = { connect };