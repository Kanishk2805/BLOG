import { Router } from "express";
import {
  deleteAdminPost,
  deleteAdminUser,
  getAdminPosts,
  getAdminStats,
  getAdminUsers
} from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/posts", getAdminPosts);
router.delete("/users/:id", deleteAdminUser);
router.delete("/posts/:id", deleteAdminPost);

export default router;
