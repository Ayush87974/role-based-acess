// routes/admin.js
import express from "express";
import User from "../models/User.js";
import { authenticate, requireRole, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// list users (Admin only)
router.get("/users", authenticate, requireRole("Admin"), async (req, res) => {
  const users = await User.find().select("-passwordHash").lean();
  res.json(users);
});

// change user role (Admin only)
router.post("/users/:id/role", authenticate, requireRole("Admin"), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!["Admin", "Moderator", "User"].includes(role)) return res.status(400).json({ message: "Invalid role" });
  const u = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-passwordHash").lean();
  res.json(u);
});

// example permission-guarded endpoint
router.post("/reports", authenticate, requirePermission("view_reports"), async (req, res) => {
  // only Admin/Moderator typically
  res.json({ message: "reports generated" });
});

export default router;
