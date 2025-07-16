import { google } from "googleapis";
import { Config } from "../../config";
import { OAuthService } from "../base/OAuthService";
import { User } from "../../models/User";

export class GoogleDriveAuthService extends OAuthService {
  constructor() {
    if (
      !Config.GOOGLE_CLIENT_ID ||
      !Config.GOOGLE_CLIENT_SECRET ||
      !Config.BACKEND_URI
    ) {
      throw new Error("Missing Google OAuth configuration values.");
    }
    super(
      Config.GOOGLE_CLIENT_ID,
      Config.GOOGLE_CLIENT_SECRET,
      `${Config.BACKEND_URI}/api/integrations/google/callback`
    );
  }

  getGoogleAuthUrl(): string {
    return this.getAuthUrl(["https://www.googleapis.com/auth/drive.readonly"]);
  }

  async handleCallback(code: string) {
    const tokens = await this.exchangeCode(code);
    const oauth2 = google.oauth2({ version: "v2", auth: this.client });
    const { data: profile } = await oauth2.userinfo.get();

  
  }
}
