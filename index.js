import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import postsRoutes from "./routes/posts.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/posts", postsRoutes);

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/rbac_demo";
mongoose.connect(MONGO).then(() => {
  console.log("Mongo connected");
  app.listen(process.env.PORT || 4000, () => console.log("Listening"));
});
