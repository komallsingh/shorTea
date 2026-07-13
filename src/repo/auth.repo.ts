import { pool } from "../config/db";

export interface CreateUserData {
    username: string;
    email: string;
    passwordHash: string;
}
export interface User{
    id:number;
    username:string;
    email:string;
    password_hash:string;
    created_at:Date;
}

export const createUser = async (
    userData: CreateUserData
):Promise<User> => {

    const {
        username,
        email,
        passwordHash,
    } = userData;

    const result = await pool.query(
        `
        INSERT INTO users
        (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [username, email, passwordHash]
    );

    return result.rows[0];
};

export const findByEmail = async(
    email: string
):Promise<User | undefined> =>{
    const result= await pool.query(
        `
        SELECT 
        id,
        username,email, password_hash,created_at 
        FROM users
        WHERE email=$1
        `,
        [email]
    );
    return result.rows[0];
};

export const findByUsername = async(
    username: string
):Promise<User | undefined> =>{
    const result= await pool.query(
        `
        SELECT 
        id,
        username,email, password_hash,created_at 
        FROM users
        WHERE username=$1
        `,
        [username]
    );
    return result.rows[0];
};

export const findById = async(
    id: number
):Promise<User | undefined> =>{
    const result= await pool.query(
        `
        SELECT 
        id,
        username,email, password_hash,created_at 
        FROM users
        WHERE id=$1
        `,
        [id]
    );
    return result.rows[0];
};
