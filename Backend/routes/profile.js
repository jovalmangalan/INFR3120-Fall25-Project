import express from "express";
import multer from "multer";
import User from "../models/userModel.js";

const router = express.Router();

// Multer stores file in memory (not disk)
const upload = multer({ storage: multer.memoryStorage() });

// Show profile page
router.get("/", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("profile");
});

// Upload profile image
router.post("/upload", upload.single("profileImage"), async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  if (!req.file) return res.send("No file uploaded.");

  await User.findByIdAndUpdate(req.session.userId, {
    profileImage: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
  });

  res.redirect("/profile");
});

export default router;
