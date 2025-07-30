import { Config } from "../config";
import { SUPPORTED_APPS } from "../types/index.types";

export const INTEGRATION_CONFIGS = {
  google_drive: {
    name: "google-drive",
    displayName: "Google Drive",
    strategy: "google-drive",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "openid",
      "email",
      "profile",
    ],
    authOptions: {
      access_type: "offline",
      prompt: "consent",
    },
    icon: "https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-64dp/logo_drive_2020q4_color_2x_web_64dp.png",
    description: "Access your Google Drive files",
    clientId: Config.GOOGLE_CLIENT_ID,
    clientSecret: Config.GOOGLE_CLIENT_SECRET,
    callbackPath: "/callback",
  },
};

export const getIntegrationConfig = (appName: SUPPORTED_APPS) => {
  return INTEGRATION_CONFIGS[appName];
};

export const isValidIntegration = (appName: SUPPORTED_APPS) => {
  return appName in INTEGRATION_CONFIGS;
};
