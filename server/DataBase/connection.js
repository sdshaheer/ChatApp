const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to Data Base");
  } catch (error) {
    console.log(`Mongo connection error ${error}`);
  }
};

module.exports = connectDB;
