import { Router } from "express";
import { generateQR } from "../controllers/qr.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/:shortCode/qr",
  authMiddleware,
  asyncHandler(generateQR)
);

export default router;