import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModels from '../models/user.models';

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    async (accessToken, refreshToken, profile, done) => {

        if (!profile.emails || !profile.emails[0]?.value) {
            return done(new Error('Email not found in Google profile'), false);
        }

        const email = profile.emails?.[0].value as string;

        let user = await userModels.findOne({ email });

        if (!user) {
            user = await userModels.create({
                name: profile.displayName,
                email: email
            })
        }
        done(null, user);
    }
));

export default passport;