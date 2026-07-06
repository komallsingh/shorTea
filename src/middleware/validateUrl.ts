import { Request,Response,NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validateUrl= (
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const {url}= req.body;

    if(!url){
        return next(
            new AppError(
                "url required",
                400
            )
        );
    }
    next();
};