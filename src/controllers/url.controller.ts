import * as service from "../services/url.service";
import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";

interface ShortCodeParams {
  shortCode: string;
}


export const createShortUrl = async(
    req: Request,res: Response
)=>{
    const {url} = req.body;
    const result= await service.createShortUrl(url);

    res.status(201).json(
        {
            success: true,
            data: result
        }
    );
};

export const getOriginalUrl = async(
    req: Request<ShortCodeParams>,
    res: Response
)=>{
    const {shortCode} = req.params;
    const userAgent=req.get("User-Agent") ?? "";
    const url= await service.getOriginalUrl(shortCode,userAgent);  
    res.redirect(url.original_url);
}

export const getUrlStats=async(
    req: Request<ShortCodeParams>,
    res:Response
)=>{
    const {shortCode}=req.params;
    const url=await service.getUrlStats(shortCode);
    console.log("URL:", url);
    console.log("TYPE:", typeof url);
    return res.json({
        success: true,
        data:{
            id: url.id,
            shortCode:url.short_code,
            originalUrl: url.original_url,
            clickCount: url.click_count,
            createdAt: url.created_at
        }
    });
};

export const getBrowserStats = async (
    req: Request<ShortCodeParams>,
    res: Response
) => {
    const { shortCode } = req.params;

    const browserStats = await analyticsService.getBrowserStats(
        shortCode
    );

    return res.json({
        success: true,
        data: browserStats,
    });
};