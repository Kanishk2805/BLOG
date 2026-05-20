import { Router } from "express";
import {
  getMyBookmarks,
  toggleBookmark,
  toggleLike
} from "../controllers/interactions.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/like", requireAuth, toggleLike);
router.post("/bookmark", requireAuth, toggleBookmark);
router.get("/bookmarks", requireAuth, getMyBookmarks);

export default router;
