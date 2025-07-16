import mongoose from "mongoose";
import { Config } from ".";

export const connectDB = async () => {
  try {
    if (!Config.MONGODB_URI) throw new Error("No URI provided for DB");
    await mongoose.connect(Config.MONGODB_URI);
    console.log("✅ DB connection successful");
  } catch (err) {
    console.error("Error occured while connecting to DB: ", err);
  }
};
