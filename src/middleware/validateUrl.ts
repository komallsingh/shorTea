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
    let parsedUrl:URL;
    try{
        parsedUrl=new URL(url);
    }catch{
        return next(
            new AppError(
                "invalid url",
                400
            )
        );
    }
    if(
        parsedUrl.protocol!="http" &&
        parsedUrl.protocol!="https:"
    ){
        return next(
            new AppError(
                "Only HTTP/HTTPS URLs are allowed",
                400
            )
        );
    }
    next();
};