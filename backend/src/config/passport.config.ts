import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModels from "../models/user.models.js";
import env from "./env.config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("No email from Google"), false);

      try {
        const user = await userModels
          .findOneAndUpdate(
            { email },
            {
              $setOnInsert: {
                name: profile.displayName,
                email,
                authProvider: "google",
                verified: true,
              },
            },
            { new: true, upsert: true },
          )
          .lean();

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

export default passport;
