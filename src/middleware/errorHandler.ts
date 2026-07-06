import {Request, Response, NextFunction} from "express";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode =  error.statusCode || 500;
    res.status(
        statusCode
    ).json({
        success: false,
        message: error.message || "internal server error"
    });
};