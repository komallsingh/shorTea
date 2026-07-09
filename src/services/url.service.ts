import { generateShortCode } from "../utils/generateShortCode"
import * as repo from "../repo/url.repo";
import { AppError } from "../utils/AppError";
import { checkUrlSafety } from "./spam.service";
import { parseUserAgent } from "../utils/userAgent";
import * as analyticsRepo from "../repo/analytic.repo";

export const createShortUrl = async(
    originalUrl:string
)=>{
    const safety = await checkUrlSafety(originalUrl);

     if (!safety.safe) {
      throw new AppError(
        safety.message,
        400
       );
    }

    const existingurl=await repo.findByUrl(originalUrl);
    if(existingurl){
        return existingurl;
    }
    const shortCode=generateShortCode();
    return await repo.createUrl(
        shortCode,
        originalUrl
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

export const getUrlStats=async(
    shortCode:string
)=>{
    const url=await repo.findByShortCode(shortCode);
    if(!url){
        throw new AppError(
            "url not found",
            404
        );
    }
    return url;
}