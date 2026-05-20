import { Router } from "express";
import { createOrUpdateRating, getPostRatings } from "../controllers/ratings.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createOrUpdateRating);
router.get("/:postId", getPostRatings);

export default router;
