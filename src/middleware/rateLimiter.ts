import {rateLimit} from "express-rate-limit";
import { success } from "zod";

export const rateLimiter= rateLimit({
    windowMs: 15*60*1000, //15 mins
    limit: 100, //max 100 req per IP
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        success: false,
        message: "Too many requests, Please try again after sometime."
    }
});

