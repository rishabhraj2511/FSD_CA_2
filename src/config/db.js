const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Feedback/';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

module.exports = connectDatabase;
