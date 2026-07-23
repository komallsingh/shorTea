import { Router } from "express";
import { getOriginalUrl } from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/:shortCode", asyncHandler(getOriginalUrl));

export default router;