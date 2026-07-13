import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authMiddleware= (
    req:Request,
    res: Response,
    next: NextFunction
)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader){
        throw new AppError(
            "Authorization token required",
            401);
    }
    if (!authHeader.startsWith("Bearer ")) {
    throw new AppError(
        "Invalid authorization header",
        401
    );
}
    const token = authHeader.split(' ')[1];
    if(!token){
        throw new AppError(
            "invalid token",
            401
        );
    }
        const decoded= verifyToken(token);
        req.user= decoded;
        next();

}