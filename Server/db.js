const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/yourDatabase'), 
        console.log('db connected')
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
}
  
  module.exports = connectDB;