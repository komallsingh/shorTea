import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validate =
    (schema: ZodTypeAny) =>
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(
                new AppError(
                    result.error.issues[0].message,
                    400
                )
            );
        }

        req.body = result.data;
        next();
    };