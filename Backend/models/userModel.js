import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  securityQuestion: { type: String, required: true },
  securityAnswerHash: { type: String, required: true },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
