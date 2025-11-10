// routes/posts.js (very minimal demo; assumes Post model exists)
import express from "express";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";
import Post from "../models/Post.js";

const router = express.Router();

router.post("/", authenticate, requirePermission("create_post"), async (req, res) => {
  const { title, body } = req.body;
  const p = new Post({ title, body, authorId: req.user._id, authorName: req.user.username });
  await p.save();
  res.json(p);
});

// edit: owner or role-permission edit_any_post
router.put("/:id", authenticate, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  const isOwner = String(post.authorId) === String(req.user._id);
  const roleCanEditAny = (ROLE_PERMISSIONS[req.user.role] || []).includes("edit_any_post");
  if (!isOwner && !roleCanEditAny) return res.status(403).json({ message: "Forbidden" });

  post.title = req.body.title ?? post.title;
  post.body = req.body.body ?? post.body;
  await post.save();
  res.json(post);
});
