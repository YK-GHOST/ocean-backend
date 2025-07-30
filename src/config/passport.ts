import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from ".";
import { GoogleUser, User } from "../models/User";
import { encrypt } from "../utils/cryptoUtils";
import { UserService } from "../services/UserService";
import { Connection } from "../models/Connection";
import { Integration } from "../models/Integration";

let userService;

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: Config.GOOGLE_CLIENT_ID_LOGIN!,
      clientSecret: Config.GOOGLE_CLIENT_SECRET_LOGIN!,
      callbackURL: `${Config.BACKEND_URI}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        userService = new UserService(GoogleUser);
        let user = await userService.findOne({ googleId: profile.id });
        console.log("user: ", user);
        if (!user) {
          user = await userService.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            gAccessToken: encrypt(accessToken),
            gRefreshToken: encrypt(refreshToken),
            provider: "google",
            profilePicture: profile.photos?.[0]?.value,
          });
        } else {
          userService.update(profile.id, {
            gAccessToken: encrypt(accessToken),
            ...(refreshToken ? { gRefreshToken: encrypt(refreshToken) } : {}),
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  "google-drive",
  new GoogleStrategy(
    {
      clientID: Config.GOOGLE_CLIENT_ID!,
      clientSecret: Config.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${Config.BACKEND_URI}/api/connection/google_drive/callback`,
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      params: any,
      done: any
    ) => {
      console.log("🚀 Google Drive Strategy Called");
      try {
        const userId = req.user?.id;
        if (!userId) return done(new Error("User not logged in"), false);

        const integration = await Integration.findOne({ name: "google_drive" });
        if (!integration) {
          console.error("❌ Integration 'google_drive' not found in database");
          return done(new Error("Integration not found"), false);
        }
        console.log("✅ Integration found:", integration._id);
        let connection = await Connection.findOne({
          userId,
          integration: integration?._id,
        }); //TODO make a generic connection service just like user service
        console.log(
          "🔍 Existing connection:",
          connection ? "Found" : "Not found"
        );
        const connectionData = {
          userId,
          integration: integration?._id,
          accessToken: encrypt(accessToken),
          encrypted: true,
          metadata: {
            expiries_in: params.expires_in,
            scope: params.scope,
            token: params.id_token,
            token_type: params.token_type,
          },
          expiresAt: params.expires_in
            ? new Date(Date.now() + params.expires_in * 1000)
            : undefined,
        } as any;
        if (refreshToken) {
          connectionData.refreshToken = encrypt(refreshToken);
        }
        if (!connection) {
          console.log("🆕 Creating new connection...");
          connection = await Connection.create(connectionData);
          console.log("✅ New connection created:", connection._id);
        } else {
          console.log("🔄 Updating existing connection...");
          Object.assign(connection, connectionData);
          await connection.save();
          console.log("✅ Connection updated:", connection._id);
        }

        return done(null, connection);
      } catch (err) {
        console.error("❌ Error in Google Drive strategy:", err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});
