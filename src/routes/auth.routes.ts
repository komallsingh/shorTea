import {Router} from "express";
import * as controller from "../controllers/auth.controller"
import {asyncHandler} from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import {
    registerSchema,
    loginSchema,
} from "../validation/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(controller.registerUser));
router.post("/login", validate(loginSchema), asyncHandler(controller.loginUser));

export default router;