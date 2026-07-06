import {Router} from "express";
import {createShortUrl, getOriginalUrl} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router=Router();

router.post("/shorten",
    asyncHandler(createShortUrl)
);

router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);

export default router;