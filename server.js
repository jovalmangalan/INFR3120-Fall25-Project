import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import appointmentsRouter from "./Backend/routes/appointments.js";

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

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Static files
app.use(express.static("public"));

// Routes
app.use("/", appointmentsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
