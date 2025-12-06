import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

/* =============================
   REGISTER PAGE
============================= */
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswerHash: hashedAnswer
    });

    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Error registering user.");
  }
});

/* =============================
   LOGIN PAGE
============================= */
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    if (!user.password)
      return res.send("This account uses OAuth login. Try Google/GitHub/Discord.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Incorrect password");

    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error logging in.");
  }
});

/* =============================
   LOGOUT
============================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* =============================
   FORGOT PASSWORD
============================= */
router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("No account with that email");

  res.render("answerSecurity", {
    email: user.email,
    securityQuestion: user.securityQuestion
  });
});

/* =============================
   RESET PASSWORD
============================= */
router.post("/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("No account found");

    const match = await bcrypt.compare(securityAnswer, user.securityAnswerHash);
    if (!match) {
      return res.render("answerSecurity", {
        email: user.email,
        securityQuestion: user.securityQuestion,
        error: "Incorrect answer"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.render("login", { message: "Password updated successfully", error: null });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).send("Error updating password.");
  }
});

export default router;
