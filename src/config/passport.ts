import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from ".";
import { GoogleUser, User } from "../models/User";
import { encrypt } from "../utils/cryptoUtils";
import { UserService } from "../services/UserService";

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

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});
