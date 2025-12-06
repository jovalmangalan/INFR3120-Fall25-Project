import express from "express";
import passport from "passport";

const router = express.Router();

/* ------------ GOOGLE ------------ */
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Passport already returned the DB user as req.user
    req.session.userId = req.user._id;
    res.redirect("/");
  }
);

/* ------------ GITHUB ------------ */
router.get("/github",
  passport.authenticate("github")
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect("/");
  }
);

/* ------------ DISCORD ------------ */
router.get("/discord",
  passport.authenticate("discord")
);

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect("/");
  }
);

export default router;
