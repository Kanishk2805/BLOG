import { Router } from "express";
import { deleteUser, getUserById, getUsers } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUserById);
router.delete("/:id", requireAuth, deleteUser);

export default router;
