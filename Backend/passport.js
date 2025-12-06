import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";

import User from "../Backend/models/userModel.js";

/* =========================================
   SESSION HANDLING
========================================= */

// Store only user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Retrieve full user from DB based on stored ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

/* =========================================
   GOOGLE STRATEGY
========================================= */

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({
                oauthId: profile.id,
                authProvider: "google",
            });

            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                    oauthId: profile.id,
                    authProvider: "google",
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

/* =========================================
   GITHUB STRATEGY
========================================= */

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({
                oauthId: profile.id,
                authProvider: "github"
            });

            if (!user) {
                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: profile.emails?.[0]?.value || null,
                    oauthId: profile.id,
                    authProvider: "github",
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

/* =========================================
   DISCORD STRATEGY
========================================= */

passport.use(new DiscordStrategy(
    {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({
                oauthId: profile.id,
                authProvider: "discord",
            });

            if (!user) {
                user = await User.create({
                    name: profile.username,
                    email: profile.email || null,
                    oauthId: profile.id,
                    authProvider: "discord",
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

export default passport;
