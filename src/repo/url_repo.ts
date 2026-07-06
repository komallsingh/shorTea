import { shareProtocol } from "node:stream/iter";
import {pool} from "../config/db";

export async function createUrl(
    shortCode:string,
    originalURL:string
){
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