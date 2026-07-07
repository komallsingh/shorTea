import { shareProtocol } from "node:stream/iter";
import {pool} from "../config/db";

export const createUrl = async(
    shortCode:string,
    originalURL:string
)=>{
    const res= await pool.query(
        `
        INSERT INTO urls
        (short_code,original_url)
        VALUES ($1, $2)
        RETURNING *
        `,
        [shortCode,originalURL]
    );
    return res.rows[0];
}

export const findByShortCode = async(
    shortCode: string
) => {
    const res= await pool.query(
        `
        SELECT * 
        FROM urls
        WHERE short_code = $1
        `,
        [shortCode]
    );
    return res.rows[0];
};

export const findByUrl = async(
    originalUrl:string
)=>{
    const result=await pool.query(
        `
        SELECT * 
        FROM urls
        WHERE original_url=$1
        `,
        [originalUrl]
    );
    return result.rows[0];
}