import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import postsRoutes from "./posts.routes.js";
import ratingsRoutes from "./ratings.routes.js";
import adminRoutes from "./admin.routes.js";
import interactionsRoutes from "./interactions.routes.js";
import commentsRoutes from "./comments.routes.js";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.post("/register", register);
router.post("/login", login);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/ratings", ratingsRoutes);
router.use("/comments", commentsRoutes);
router.use("/admin", adminRoutes);
router.use("/interactions", interactionsRoutes);

export default router;
