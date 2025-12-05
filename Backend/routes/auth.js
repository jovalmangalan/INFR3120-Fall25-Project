// Backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

// =============================
//  REGISTER
// =============================

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER USER
router.post("/register", async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.send("User with that email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswerHash: hashedAnswer,
    });

    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Error registering user.");
  }
});

// =============================
//  LOGIN / LOGOUT
// =============================

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Wrong password");

    req.session.userId = user._id;
    res.redirect("/schedule");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error logging in.");
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// =============================
//  FORGOT PASSWORD
// =============================

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("No user found with that email.");
    }

    res.render("answerSecurity", {
      email: user.email,
      securityQuestion: user.securityQuestion,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).send("Error processing forgot password.");
  }
});

// =============================
//  RESET PASSWORD
// =============================

router.post("/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("No user found with that email.");
    }

    const answerMatch = await bcrypt.compare(
      securityAnswer,
      user.securityAnswerHash
    );
    if (!answerMatch) {
      return res.render("answerSecurity", {
        email: user.email,
        securityQuestion: user.securityQuestion,
        error: "Security answer is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.render("login", {
      message: "Password updated successfully. Please log in.",
      error: null,
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).send("Error resetting password.");
  }
});
export default router;


