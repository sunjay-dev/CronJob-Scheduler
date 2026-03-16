import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import logger from "./utils/logger.utils.js";

const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start Server
app.listen(port, () => {
  logger.info(`Server running on Port ${port}`);
});
