import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

interface ConfigType {
  PORT?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID_LOGIN?: string;
  GOOGLE_CLIENT_SECRET_LOGIN?: string;
  BACKEND_URI?: string;
  JWT_SECRET?: string;
  MONGODB_URI?: string;
  ENCRYPTION_KEY?: string;
  SESSION_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  JWT_COOKIE_EXPIRES_IN: number;
  FRONTEND_URI?: string;
  NODE_ENV?: string;
}

export const Config: ConfigType = {
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
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN!),
  FRONTEND_URI: process.env.FRONTEND_URI,
  NODE_ENV: process.env.NODE_ENV,
};
