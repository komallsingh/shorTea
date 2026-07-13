import {Router} from "express";
import * as controller from "../controllers/auth.controller"
import {asyncHandler} from "../middleware/asyncHandler";
const router = Router();

router.post("/register",asyncHandler(controller.registerUser));
router.post("/login",asyncHandler(controller.loginUser));

export default router;