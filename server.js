import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import appointmentsRouter from "./Backend/routes/appointments.js";
import authRoutes from "./Backend/routes/auth.js";
import profileRoutes from "./Backend/routes/profile.js";

import User from "./Backend/models/userModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// =============================
//  MongoDB Connection
// =============================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Error:", err));

// =============================
//  Middleware
// =============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);

// Make session + logged-in user available everywhere
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      req.user = user;
      res.locals.user = user;
    } catch (err) {
      console.error(err);
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// =============================
//  Serve Profile Images
// =============================
app.get("/profile/image", async (req, res) => {
  if (!req.session.userId) return res.status(404).send("No image");

  const user = await User.findById(req.session.userId);

  if (!user || !user.profileImage || !user.profileImage.data)
    return res.status(404).send("No image");

  res.contentType(user.profileImage.contentType);
  res.send(user.profileImage.data);
});

// =============================
//  View Engine / Static Files
// =============================
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static("public"));

// =============================
//  Routes
// =============================
app.use("/", authRoutes);
app.use("/", appointmentsRouter);
app.use("/profile", profileRoutes);

// =============================
//  Start Server
// =============================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
