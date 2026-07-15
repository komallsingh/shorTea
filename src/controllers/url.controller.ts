import * as service from "../services/url.service";
import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";
import { success } from "zod";

interface ShortCodeParams {
  shortCode: string;
}


export const createShortUrl = async(
    req: Request,res: Response
)=>{
    const {url} = req.body;
    const userId = req.user.id;
    const result= await service.createShortUrl(url,userId);
    
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
    const urls= await service.getMyUrls(userId);
    return res.status(200).json({
        success:true,
        data: urls,
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
    const {url}=req.body;
    const userId=req.user.id;
    const result= await service.updateMyUrl(
        shortCode,
        url,
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