const mongoose = require('mongoose');

module.exports = async () => {
    try {
      await mongoose.connect(process.env.DB_LOCAL_URI, {});
      console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
      console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};
