import express from "express";
import passport from "passport";
import User from "../models/userModel.js";

const router = express.Router();

/* ---------------- GOOGLE ---------------- */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    let existing = await User.findOne({ oauthId: req.user.id, authProvider: "google" });

    if (!existing) {
      existing = await new User({
        name: req.user.displayName,
        email: req.user.emails?.[0]?.value || null,
        oauthId: req.user.id,
        authProvider: "google",
      }).save();
    }

    req.session.userId = existing._id;
    res.redirect("/");
  }
);

/* ---------------- GITHUB ---------------- */
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    let existing = await User.findOne({ oauthId: req.user.id, authProvider: "github" });

    if (!existing) {
      existing = await new User({
        name: req.user.displayName || req.user.username,
        email: req.user.emails?.[0]?.value || null,
        oauthId: req.user.id,
        authProvider: "github",
      }).save();
    }

    req.session.userId = existing._id;
    res.redirect("/");
  }
);

/* ---------------- DISCORD ---------------- */
router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  async (req, res) => {
    let existing = await User.findOne({ oauthId: req.user.id, authProvider: "discord" });

    if (!existing) {
      existing = await new User({
        name: req.user.username,
        email: req.user.email,
        oauthId: req.user.id,
        authProvider: "discord",
      }).save();
    }

    req.session.userId = existing._id;
    res.redirect("/");
  }
);

export default router;
