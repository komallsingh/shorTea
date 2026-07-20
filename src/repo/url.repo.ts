import {pool} from "../config/db";

export const createUrl = async(
    shortCode:string,
    originalURL:string,
    userId:number
)=>{
    const res= await pool.query(
        `
        INSERT INTO urls
        (short_code,original_url,user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [shortCode,originalURL,userId]
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



export const counter=async(
    shortCode: string
)=>{
    await pool.query(
        `
        UPDATE urls
        SET click_count=click_count+1
        WHERE short_code=$1
        `,
        [shortCode]
    );
    
};

export const findByUrlAndUser=async(
    originalUrl:string,
    userId:number
)=>{
    const result=await pool.query(
        `
        SELECT * 
        FROM urls
        WHERE original_url=$1 AND user_id=$2
        `,
        [originalUrl,userId]
    );
    return result.rows[0];
}


export const findByShortCodeAndUser=async(
    shortCode:string,
    userId:number
)=>{
    const result=await pool.query(
        `
        SELECT * 
        FROM urls
        WHERE short_code=$1 AND user_id=$2
        `,
        [shortCode,userId]
    );
    return result.rows[0];
}

export const findAllByUser=async(
    userId: number,
    limit: number,
    offset: number
)=>{
    const result=await pool.query(
        `
        SELECT 
        id,
        short_code,
        original_url,
        click_count,
        TO_CHAR(created_at, 'DD Mon YYYY, HH12:MI AM') AS creation_data
        FROM urls
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [userId, limit, offset]
    );
    return result.rows;
}

export const deleteUrl=async(
    shortCode: string
)=>{
    await pool.query(
        `
        DELETE FROM urls
        WHERE short_code=$1
        `,[shortCode]
    );
};

export const updateUrl=async(
    shortCode:string,
    originalUrl:string
)=>{
    const result = await pool.query(
        `
        UPDATE urls
        SET original_url = $1
        WHERE short_code = $2
        RETURNING *
        `,
        [originalUrl, shortCode]
    );

    return result.rows[0]; 
};

export const countUrlsByUser=async(
    userId:number
)=>{
    const result=await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM urls
        WHERE user_id=$1
        `,
        [userId]
    );
    return Number(result.rows[0].total);
}