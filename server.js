import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import appointmentsRouter from "./Backend/routes/appointments.js";
import authRoutes from "./Backend/routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Error:", err));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: "superSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Make session available inside all EJS pages (Part 8)
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Static files
app.use(express.static("public"));

// Routes
app.use("/", authRoutes);            // <-- Login / Register / Logout
app.use("/", appointmentsRouter);    // <-- Schedule / Edit / Delete / Calendar / Home

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
