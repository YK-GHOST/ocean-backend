import { OAuth2Client } from "google-auth-library";

export abstract class OAuthService {
  protected client: OAuth2Client;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  getAuthUrl(
    scope: string[],
    accessType: string = "offline",
    prompt: string = "consent"
  ): string {
    return this.client.generateAuthUrl({
      access_type: accessType,
      prompt,
      scope,
    });
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
    return tokens;
  }

  async refreshAccessToken(refreshToken: string) {
    this.client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.client.refreshAccessToken();
    return credentials;
  }

  async revokeToken(token: string) {
    await this.client.revokeToken(token);
  }
}
