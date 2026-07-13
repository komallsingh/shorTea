import bcrypt from "bcrypt";
import { boolean } from "zod";

const SALT_ROUNDS=10; 

export const hashPassword = async(
    password: string
): Promise<string> =>{
    return bcrypt.hash(password,SALT_ROUNDS);
};

export const comparePassword = async(
    password: string,
    passwordHash: string
): Promise<boolean> => {
    return bcrypt.compare(password,passwordHash);
}

// 8 → Faster, less secure.
// 10 → Good balance (widely used in production).
// 12 → More secure but slower.
// 14+ → Usually reserved for systems with stricter security requirements.

// For this project, 10 is a solid choice.