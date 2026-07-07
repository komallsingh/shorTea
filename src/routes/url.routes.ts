import {Router} from "express";
import {createShortUrl, getOriginalUrl} from "../controllers/url.controller";
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

router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);




export default router;