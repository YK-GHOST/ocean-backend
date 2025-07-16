import app from "./app";
import { Config } from "./config";
import { connectDB } from "./config/db";

const init = async () => {
  const PORT = Config.PORT;
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log("Hey welcome to the spaceship on space port: ", PORT)
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

init();
