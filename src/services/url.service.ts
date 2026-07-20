import { generateShortCode } from "../utils/generateShortCode"
import * as repo from "../repo/url.repo";
import { AppError } from "../utils/AppError";
import { checkUrlSafety } from "./spam.service";
import { parseUserAgent } from "../utils/userAgent";
import * as analyticsRepo from "../repo/analytic.repo";
import { getOwnedUrl } from "./authorization.service";


export const createShortUrl = async(
    originalUrl:string,
    userId:number
)=>{
    const safety = await checkUrlSafety(originalUrl);

     if (!safety.safe) {
      throw new AppError(
        safety.message,
        400
       );
    }

    const existingurl=await repo.findByUrlAndUser(originalUrl, userId);
    if(existingurl){
        return existingurl;
    }
    const shortCode=generateShortCode();
    return await repo.createUrl(
        shortCode,
        originalUrl,  
        userId  
    );
};


export const getOriginalUrl= async(
    shortCode: string,
    userAgent:string = ""
)=>{
    const url= await repo.findByShortCode(shortCode);

    if(!url){
        throw new AppError(
            "URL not found",
            404
        );
    }
    await repo.counter(shortCode);
    const analytics=parseUserAgent(userAgent);
    try{
    await analyticsRepo.saveClick(
        {
            urlId: url.id,
            browser: analytics.browser,
            os:analytics.os,
            device: analytics.device,
        }
    );
}catch(error){
    console.error("Failed to savee analytics for ",shortCode,error);
}

    return url;
};

export const getUrlStats = async (
    shortCode: string,
    userId: number
) => {
    return await getOwnedUrl(
        shortCode,
        userId
    );
};

export const getMyUrls = async (
    userId: number,
    page: number,
    limit: number,
    search: string,
    sort: string,
    order: string
) => {
    const offset = (page - 1) * limit;
    const sortColumn =
    sort === "clicks"
        ? "click_count"
        : "created_at";
    const sortOrder =
    order.toLowerCase() === "asc"
        ? "ASC"
        : "DESC";
    const [urls, totalRecords] = await Promise.all([
        repo.findAllByUser(userId, limit, offset,search, sortColumn, sortOrder),
        repo.countUrlsByUser(userId,search)
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
        urls,
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
        }
    };
};

export const deleteMyUrl=async(
    shortCode:string,
    userId:number
)=>{
    await getOwnedUrl(shortCode,userId);
    return await repo.deleteUrl(shortCode);
}

export const updateMyUrl=async(
    shortCode: string,
    originalUrl: string,
    userId: number
) =>{
    const url=await getOwnedUrl(shortCode,userId);
    
    if( url.original_url===originalUrl){
        throw new AppError(
            "New URL must be different from current URL",
            400
        );
    }
    const existing=await repo.findByUrlAndUser(originalUrl,userId);
    if(existing){
        return {
            alreadyExists:true,
            url: existing
        };
    }

    const check=await checkUrlSafety(originalUrl);
    if(!check.safe){
        throw new AppError(
            check.message,
            400
        );
    }
    const updated=await repo.updateUrl(shortCode,originalUrl);
    return {
        alreadyExist: false,
        url: updated,
    };
};