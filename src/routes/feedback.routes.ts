import { Router } from "express";
import * as feedbackController from "../controllers/feedback.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/report-bug",
    authMiddleware,
    feedbackController.reportBug
);

export default router;