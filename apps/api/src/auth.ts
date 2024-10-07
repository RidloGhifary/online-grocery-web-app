import { Request } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import loginWithGoogle from './utils/loginWithGoogle';
import jwt from 'jsonwebtoken';

const GoogleStrategy = require('passport-google-oauth2').Strategy;

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-client-id';
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret';
const API_URL = process.env.API_URL || 'http://localhost:8000'
const GOOGLE_CALLBACK_URL = `${API_URL}/api/auth/google/callback`||"/api/auth/google/callback"

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (
      request: Request,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any,
    ) {
      const user = await loginWithGoogle({
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        username: profile.displayName,
        email: profile.email,
        image: profile.photos[0].value,
      });

      if (!user) {
        return done(null, false);
      }

      // Generate a JWT token
      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      });

      return done(null, { user, token });
    },
  ),
);

passport.serializeUser(function (
  user: unknown,
  done: (err: any, user: false | any | null | undefined) => void,
) {
  if (user === false || user === null || user === undefined) {
    done(null, user);
  } else {
    done(null, user);
  }
});

passport.deserializeUser(function (
  user: unknown,
  done: (err: any, user: false | any | null | undefined) => void,
) {
  if (user === false || user === null || user === undefined) {
    done(null, user);
  } else {
    done(null, user);
  }
});
