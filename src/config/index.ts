import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

export const Config = {
  PORT: process.env.PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID_LOGIN: process.env.GOOGLE_CLIENT_ID_LOGIN,
  GOOGLE_CLIENT_SECRET_LOGIN: process.env.GOOGLE_CLIENT_SECRET_LOGIN,
  BACKEND_URI: process.env.BACKEND_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN!),
  JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN!),
};
