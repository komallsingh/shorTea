import {Router} from "express";
import {createShortUrl, getOriginalUrl, getBrowserStats} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateUrl } from "../middleware/validateUrl";
import { getUrlStats } from "../controllers/url.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router=Router();

router.post("/shorten",
    authMiddleware,
    validateUrl,
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