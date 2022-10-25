const mongoose = require('mongoose');
const dotenv = require('dotenv');

//.env setup
dotenv.config({ path: '.env' });

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log('Error connecting to MongoDB');
    return new Error(error.message);
  }
}

module.exports = { connect };
