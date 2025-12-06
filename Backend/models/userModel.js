import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },

  // Password NOT required for OAuth users
  password: { type: String, required: false },

  // Local-auth only
  securityQuestion: { type: String, required: false },
  securityAnswerHash: { type: String, required: false },

  // Profile image stored in MongoDB
  profileImage: {
    data: Buffer,
    contentType: String,
  },

  // OAuth fields
  authProvider: { type: String, default: "local" },
  oauthId: { type: String, default: null },
});

export default mongoose.model("User", userSchema);
