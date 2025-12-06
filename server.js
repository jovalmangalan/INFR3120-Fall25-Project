import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./Backend/passport.js";
import appointmentsRouter from "./Backend/routes/appointments.js";
import authRoutes from "./Backend/routes/auth.js";
import oauthRoutes from "./Backend/routes/oauthroutes.js";
import profileRoutes from "./Backend/routes/profileRoutes.js";
import User from "./Backend/models/userModel.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===============================
// DATABASE
// ===============================
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

// ===============================
// BODY PARSING
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// SESSION
// ===============================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  })
);

// ===============================
// PASSPORT
// ===============================
app.use(passport.initialize());
app.use(passport.session());

// ===============================
// LOAD USER INTO EJS
// ===============================
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      req.user = user;
      res.locals.user = user;
    } catch {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// ===============================
// SERVE PROFILE IMAGES
// ===============================
app.get("/profile/image", async (req, res) => {
  if (!req.session.userId) return res.status(404).send("No image");

  const user = await User.findById(req.session.userId);
  if (!user?.profileImage?.data) return res.status(404).send("No image");

  res.contentType(user.profileImage.contentType);
  res.send(user.profileImage.data);
});

// ===============================
// STATIC FILES + VIEW ENGINE
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static("public"));

// ===============================
// ROUTES
// ===============================
app.use("/", authRoutes);
app.use("/", appointmentsRouter);
app.use("/auth", oauthRoutes);   // Google/GitHub/Discord OAuth
app.use("/profile", profileRoutes);

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
