import * as repo from "../repo/auth.repo";
import { AppError } from "../utils/AppError";
import {hashPassword,comparePassword } from "../utils/password";
import {generateToken, verifyToken} from "../utils/jwt"



// Client
//    │
//    ▼
// Validation (Zod)
//    │
//    ▼
// Controller
//    │
//    ▼
// Service
//    │
//    ├── Check username exists
//    │
//    ├── Check email exists
//    │
//    ├── Hash password
//    │
//    ├── Create user
//    │
//    ├── Generate JWT
//    │
//    ▼
// Return User + Token

export interface RegisterUserData{
    username:string;
    email:string;
    password:string;
}
export interface AuthResponse {
    user: {
        id: number;
        username: string;
        email: string;
    };
    token: string;
}

export const registerUser = async(
    userData:RegisterUserData
):Promise<AuthResponse> =>{
    const {username, email, password} = userData;
    const [existingEmail, existingUsername] = await Promise.all(
        [
            repo.findByEmail(email),
            repo.findByUsername(username),
        ]
    );

    if(existingEmail){
        throw new AppError(
            "Email already exists",
            409
        );
    }

    if(existingUsername){
        throw new AppError(
            "Username already exists",
            409
        );
    }
    const passwordHash= await hashPassword(password);
    const user= await repo.createUser({
        username,
        email,
        passwordHash
    });
    if (!user) {
    throw new AppError(
        "Unable to create user",
        500
    );
}
    const token= generateToken(user.id);
    return {
    user: {
        id: user.id,
        username: user.username,
        email: user.email,
    },
    token,
};
}

// Login Request
//         │
//         ▼
// Find User by Email
//         │
//         ▼
// User Exists?
//         │
//         ▼
// Compare Password
//         │
//         ▼
// Password Correct?
//         │
//         ▼
// Generate JWT
//         │
//         ▼
// Return User + Token

export interface LoginUserData{
    email:string;
    password:string;
}

export const loginUser= async(
    userData:LoginUserData
):Promise<AuthResponse>=>{
    const {email, password} = userData;
    const user= await repo.findByEmail(email);
    if (!user) {
    throw new AppError(
        "Invalid email or password",
        401
    );
}
const samePassword = await comparePassword(
    password,
    user.password_hash
);
if (!samePassword) {
    throw new AppError(
        "Invalid email or password",
        401
    );
}
const token = generateToken(user.id);
return {
    user: {
        id: user.id,
        username: user.username,
        email: user.email,
    },
    token,
};
}