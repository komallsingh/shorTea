//generating a jwt
// HEADER
//    │
// PAYLOAD
//    │
// SIGNATURE
import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

export interface TokenPayload {
    id: number;
}

export const generateToken = (
    userId: number
): string => {

    const secret = process.env.JWT_SECRETKEY;

    if (!secret) {
        throw new Error("JWT_SECRETKEY is not configured");
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];
    return jwt.sign(
        { id: userId },
        secret,
        {
            expiresIn,
        }
    );
};

export const verifyToken = (
    token: string
): TokenPayload => {

    const secret = process.env.JWT_SECRETKEY;

    if (!secret) {
        throw new Error("JWT_SECRETKEY is not configured");
    }

    try {
        return jwt.verify(
            token,
            secret
        ) as TokenPayload;
    } catch {
        throw new AppError(
            "Invalid or expired token",
            401
        );
    }
};