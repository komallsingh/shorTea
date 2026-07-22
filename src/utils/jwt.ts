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

    console.log("========== JWT GENERATION ==========");
    console.log("SECRET:", secret);
    console.log("USER ID:", userId);
    console.log("EXPIRES:", process.env.JWT_EXPIRES_IN ?? "1d");
    console.log("====================================");

    const expiresIn =
        (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];

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

    console.log("SECRET:", secret);
    console.log("TOKEN:", token);

    try {

        const decoded = jwt.verify(
            token,
            secret
        ) as TokenPayload;

        console.log("VERIFY SUCCESS");
        console.log(decoded);

        return decoded;

    } catch (error) {

        console.error("VERIFY FAILED");
        console.error(error);

        throw new AppError(
            "Invalid or expired token",
            401
        );
    }
};