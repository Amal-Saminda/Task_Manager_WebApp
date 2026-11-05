
const dns = require("node:dns");
const mongoose = require("mongoose");

// Configure DNS servers
dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    // Check MongoDB URL
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully!");
    console.log(`Database: ${mongoose.connection.name}`);

  } catch (err) {
    console.error("MongoDB Connection Failed!");
    console.error("Error:", err.message);

    throw err;
  }
};

module.exports = connectDB;
