import {pool} from "../config/db";

export interface ClickAnalytics{
    urlId:number;
    browser: string,
    os: string,
    device: string
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