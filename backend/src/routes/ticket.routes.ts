import { Router } from "express";
import { create, list, updateStatus } from "../controllers/ticket.controller";  // ← Agrega updateStatus aquí
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.put("/:id", authMiddleware, updateStatus);   // ← Esta línea ya estaba bien

export default router;
