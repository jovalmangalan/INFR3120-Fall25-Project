import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER USER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashed
  });

  await newUser.save();

  res.redirect("/login");
});

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Wrong password");

  req.session.userId = user._id;

  res.redirect("/schedule");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
