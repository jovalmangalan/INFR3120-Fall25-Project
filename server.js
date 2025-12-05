// server.js
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import appointmentsRouter from "./Backend/routes/appointments.js";
import authRoutes from "./Backend/routes/auth.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// =============================
//  MongoDB connection
// =============================
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB Error:", err));
}

// =============================
//  Middleware
// =============================

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "superSecretKey",
  resave: false,
  saveUninitialized: false,
};

if (MONGO_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: MONGO_URI,
  });
  console.log("✅ Using MongoStore for sessions");
} else {
  console.warn("⚠️ MONGO_URI missing – using in-memory session store");
}

app.use(session(sessionOptions));

// Make session available in all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// =============================
//  View engine & static files
// =============================
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static("public"));

// =============================
//  Routes
// =============================
app.use("/", authRoutes);          // login / register / logout
app.use("/", appointmentsRouter);  // home / schedule / calendar / edit / delete

// =============================
//  Start server
// =============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
