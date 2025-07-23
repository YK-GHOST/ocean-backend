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
      callbackURL:
        `${Config.BACKEND_URI}/api/auth/integrations/google/callback`!,
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      params: any,
      done: any
    ) => {
      try {
        const userId = req.user?.id;
        if (!userId) return done(new Error("User not logged in"), false);
        console.log("✅ userId: ", userId);
        const integration = await Integration.findOne({ name: "google_drive" });
        let connection = await Connection.findOne({
          userId,
          integration: integration?._id,
        }); //TODO make a generic connection service just like user service
        console.log("connection: ", connection);
        if (!connection) {
          connection = await Connection.create({
            userId,
            integration: integration?._id,
            accessToken: encrypt(accessToken),
            refreshToken: encrypt(refreshToken),
            encrypted: true,
            metadata: {
              expiries_in: params.expires_in,
              scope: params.scope,
              token: params.id_token,
              token_type: params.token_type,
            },
            expiresAt: new Date(Date.now() + params.expires_in * 1000),
          });
        } else {
          connection.accessToken = encrypt(accessToken);
          if (refreshToken) {
            connection.refreshToken = encrypt(refreshToken);
          }
          connection.encrypted = true;
          connection.metadata = {
            expiries_in: params.expires_in,
            scope: params.scope,
            token: params.id_token,
            token_type: params.token_type,
          };
          connection.expiresAt = new Date(
            Date.now() + params.expires_in * 1000
          );
        }

        await connection.save();
        return done(null, connection);
      } catch (err) {
        console.error(err);
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
