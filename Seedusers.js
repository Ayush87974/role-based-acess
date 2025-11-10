import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  const admin = new User({
    username: "admin",
    email: "admin@example.com",
    passwordHash: await User.hashPassword("AdminPass123!"),
    role: "Admin"
  });
  const mod = new User({
    username: "mod",
    email: "mod@example.com",
    passwordHash: await User.hashPassword("ModPass123!"),
    role: "Moderator"
  });
  const user = new User({
    username: "alice",
    email: "alice@example.com",
    passwordHash: await User.hashPassword("UserPass123!"),
    role: "User"
  });
  await admin.save(); await mod.save(); await user.save();
  console.log("Seeded users");
  process.exit(0);
}
run();
