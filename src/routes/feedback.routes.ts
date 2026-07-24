import { Router } from "express";
import * as feedbackController from "../controllers/feedback.controller";

const router = Router();

router.post(
    "/report-bug",
    feedbackController.reportBug
);

export default router;