import * as service from "../services/url.service";
import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";
import { success } from "zod";
import { AppError } from "../utils/AppError";

interface ShortCodeParams {
  shortCode: string;
}


export const createShortUrl = async(
    req: Request,res: Response
)=>{
    const {url, customAlias} = req.body;
    const userId = req.user.id;
    const result= await service.createShortUrl(url,userId,customAlias);
    if (result.alreadyExists) {
    return res.status(200).json({
        success: true,
        message: "This URL already exists.",
        data: result.url
    });
}
    return res.status(201).json({
    success: true,
    message: "URL created successfully.",
    data: result.url
   });
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
    const userId = req.user.id;
    const url=await service.getUrlStats(shortCode, userId);
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
    const userId = req.user.id;
    const browserStats = await analyticsService.getBrowserStats(
        shortCode,userId
    );

    return res.json({
        success: true,
        data: browserStats,
    });
};

export const getMyUrls= async(
    req:Request,
    res:Response
)=>{
    const userId=req.user.id;
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10;
    const search = String(req.query.search ?? "");
    const sort = String(req.query.sort ?? "date");
    const order = String(req.query.order ?? "desc");
    const result= await service.getMyUrls(userId, page, limit, search, sort, order);
    return res.status(200).json({
        success:true,
        data: result.urls,
        pagination: result.pagination
    });
};

export const deleteMyUrl=async(
    req:Request<ShortCodeParams>,
    res:Response
)=>{
    const {shortCode}=req.params;
    const userId=req.user.id;

    await service.deleteMyUrl(shortCode,userId);
    return res.status(200).json({
        success:true,
        message:"URL deleted successfully"
});
};

export const updateMyUrl=async(
    req: Request<ShortCodeParams>,
    res: Response
)=>{
    const {shortCode}=req.params;
    const {url,customAlias}=req.body;
    const userId=req.user.id;
    const result= await service.updateMyUrl(
        shortCode,
        url,
        customAlias,
        userId 
    );

    if(result.alreadyExists){
        return res.status(200).json({
            success: true,
            message: "This URL already exists.",
            data: result.url,
        }); 
    }
    return res.status(200).json({
        success: true,
        message: "URL updated successfully.",
        data: result.url,
    });
}

export const getDailyAnalytics = async (
    req: Request<ShortCodeParams>,
    res: Response
) => {

    const { shortCode } = req.params;
    const userId = req.user.id;

    const data = await analyticsService.getDailyAnalytics(
        shortCode,
        userId
    );

    return res.json({
        success: true,
        data
    });

};