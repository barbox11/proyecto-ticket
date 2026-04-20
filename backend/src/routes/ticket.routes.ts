import { Router } from "express";
import { create, list, updateStatus, remove } from "../controllers/ticket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.put("/:id", authMiddleware, updateStatus);
router.delete("/:id", authMiddleware, remove);

export default router;
