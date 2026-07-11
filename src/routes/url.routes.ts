import {Router} from "express";
import {createShortUrl, getOriginalUrl, getBrowserStats} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateUrl } from "../middleware/validateUrl";
import { getUrlStats } from "../controllers/url.controller";

const router=Router();

router.post("/shorten",
    validateUrl,
    asyncHandler(createShortUrl)
);

router.get("/stats/:shortCode", 
    asyncHandler(getUrlStats)
);

router.get(
    "/stats/:shortCode/browser",
    asyncHandler(getBrowserStats)
);

router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);

export default router;