const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbURI = `mongodb+srv://${process.env.MY_USERNAME}:${process.env.MY_PASSWORD}@cluster0.xs7pdvx.mongodb.net/?appName=Cluster0`;
async function connectDB() {
  try {
    await mongoose.connect(dbURI, {
      //options here nothing now
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

module.exports = connectDB;
