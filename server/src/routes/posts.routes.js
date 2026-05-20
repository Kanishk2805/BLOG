import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost
} from "../controllers/posts.controller.js";
import { attachUserIfPresent, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", attachUserIfPresent, getPosts);
router.get("/:id", getPostById);
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;
