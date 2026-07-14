import {Router} from "express";
import {createShortUrl, getOriginalUrl, getBrowserStats} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { getUrlStats } from "../controllers/url.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { createUrlSchema } from "../validation/url.validation";
import { validate } from "../middleware/validate";
const router=Router();

router.post("/shorten",
    authMiddleware,
    validate(createUrlSchema),
    asyncHandler(createShortUrl)
);

router.get("/stats/:shortCode", 
    authMiddleware,
    asyncHandler(getUrlStats)
);

router.get(
    "/stats/:shortCode/browser",
    authMiddleware,
    asyncHandler(getBrowserStats)
);

router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);

export default router;