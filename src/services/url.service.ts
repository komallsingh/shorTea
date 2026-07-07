import { generateShortCode } from "../utils/generateShortCode"
import * as repo from "../repo/url.repo";
import { AppError } from "../utils/AppError";

export const createShortUrl = async(
    originalUrl:string
)=>{
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
    shortCode: string
)=>{
    const url= await repo.findByShortCode(shortCode);

    if(!url){
        throw new AppError(
            "URL not found",
            404
        );
    }
    await repo.counter(shortCode);
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