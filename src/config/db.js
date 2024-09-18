const { default: mongoose } = require("mongoose");
const logger = require("../global/utilities/logger.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`CONNECTED TO DB: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
