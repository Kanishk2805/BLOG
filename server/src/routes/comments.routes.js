import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost
} from "../controllers/comments.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/", requireAuth, createComment);
router.delete("/:id", requireAuth, deleteComment);

export default router;
