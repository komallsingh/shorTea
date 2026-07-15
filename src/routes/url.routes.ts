import {Router} from "express";
import {createShortUrl, getOriginalUrl, 
    getBrowserStats, getUrlStats, 
    getMyUrls, deleteMyUrl, updateMyUrl} from "../controllers/url.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/auth.middleware";
import { createUrlSchema } from "../validation/url.validation";
import { validate } from "../middleware/validate";
const router=Router();

router.post("/shorten",
    authMiddleware,
    validate(createUrlSchema),
    asyncHandler(createShortUrl)
);

router.get(
    "/my-urls",
    authMiddleware,
    asyncHandler(getMyUrls)
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

router.delete(
    "/:shortCode",
    authMiddleware,
    asyncHandler(deleteMyUrl)
);

router.patch(
    "/:shortCode",
    authMiddleware,
    validate(createUrlSchema),
    asyncHandler(updateMyUrl)
);
router.get("/:shortCode",
    asyncHandler(getOriginalUrl)
);

export default router;


// POST   /shorten
// GET    /my-urls
// GET    /stats/:shortCode
// GET    /stats/:shortCode/browser
// PATCH  /:shortCode
// DELETE /:shortCode
// GET    /:shortCode