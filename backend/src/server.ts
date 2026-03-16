import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import logger from "./utils/logger.utils.js";

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on Port ${port}`);
});
