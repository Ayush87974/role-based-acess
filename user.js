// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Moderator", "User"], default: "User" },
  // optional direct-permissions for user-level overrides
  permissions: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Instance helpers
userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

export default mongoose.models.User || mongoose.model("User", userSchema);
