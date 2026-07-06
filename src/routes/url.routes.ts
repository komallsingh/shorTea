import {Router} from "express";
import {createShortUrl, getOriginalUrl} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateUrl } from "../middleware/validateUrl";

const router=Router();

router.post("/shorten",
    validateUrl,
    asyncHandler(createShortUrl)
);

router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);

export default router;