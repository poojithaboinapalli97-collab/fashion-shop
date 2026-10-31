const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Database Error] MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  const maxRetries = 5;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(
        `[Database Error] Attempt ${attempt} of ${maxRetries}: MongoDB connection failed, check MONGO_URI in .env (${error.message})`
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      } else {
        console.error('[Database Error] All 5 connection attempts failed. Exiting process.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
