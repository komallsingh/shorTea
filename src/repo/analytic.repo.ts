import {pool} from "../config/db";

export interface ClickAnalytics{
    urlId:number;
    browser: string,
    os: string,
    device: string
}
export interface BrowserStat {
    browser: string;
    count: number;
}


export const saveClick=async (
    click: ClickAnalytics
)=>{
    const {
    urlId,
    browser,
    os,
    device
    } = click;
    await pool.query(
        `
        INSERT INTO url_clicks
        (url_id, browser, os, device)
        VALUES
        ($1, $2, $3, $4)
        `,
        [urlId,browser, os,device]
    )
}

export const getBrowserStats = async (
    urlId: number
): Promise<BrowserStat[]> => {

    const result = await pool.query(
        `
        SELECT
            browser,
            COUNT(*) AS count
        FROM url_clicks
        WHERE url_id = $1
        GROUP BY browser
        ORDER BY count DESC
        `,
        [urlId]
    );

    return result.rows.map(row => ({
        browser: row.browser,
        count: Number(row.count),
    }));
};