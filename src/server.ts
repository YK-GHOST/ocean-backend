import app from "./app";
import { Config } from "./config";
import { connectDB } from "./config/db";
import logger from "./config/logger";

const init = async () => {
  const PORT = Config.PORT;
  try {
    await connectDB();
    app.listen(PORT, () =>
      logger.info("Hey welcome to the spaceship on space port: ", {
        port: PORT,
      })
    );
  } catch (err) {
    logger.error("Spaceship crashed!!! ", { error: err });
    console.error(err);
    process.exit(1);
  }
};

init();
