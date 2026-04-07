import { Router } from "express";
import { create, list } from "../controllers/ticket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);

export default router;