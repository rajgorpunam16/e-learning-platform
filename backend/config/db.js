const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB Connected Successfully");
    console.log(`Host: ${connection.connection.host}`);
    console.log(`Database: ${connection.connection.name}`);
    console.log("=================================");

    return connection;
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB Connection Failed");
    console.error(error.message);

    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("querySrv")
    ) {
      console.error(
        "DNS/SRV lookup failed. Check your internet, DNS settings and MongoDB Atlas connection string."
      );
    }

    console.error("=================================");

    throw error;
  }
};

module.exports = connectDB;