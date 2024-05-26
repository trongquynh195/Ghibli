const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MOONGOOSE_URL);
    console.log('Connected successfully!');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

module.exports = { connect };