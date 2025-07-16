import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from ".";
import { GoogleUser, User } from "../models/User";
import { encrypt } from "../utils/cryptoUtils";

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
        let user = await GoogleUser.findOne({ googleId: profile.id });

        if (!user) {
          user = new GoogleUser({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            gAccessToken: encrypt(accessToken),
            gRefreshToken: encrypt(refreshToken),
            provider: "google",
            profilePicture: profile.photos?.[0]?.value,
          });
        } else {
          user.gAccessToken = encrypt(accessToken);
          if (refreshToken) user.gRefreshToken = encrypt(refreshToken);
        }
        await user.save();
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
