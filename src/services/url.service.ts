import { generateShortCode } from "../utils/generateShortCode"
import * as repo from "../repo/url.repo";
import { AppError } from "../utils/AppError";
import { checkUrlSafety } from "./spam.service";
import { parseUserAgent } from "../utils/userAgent";
import * as analyticsRepo from "../repo/analytic.repo";
import { getOwnedUrl } from "./authorization.service";


const RESERVED_ALIASES = [
    "api",
    "auth",
    "login",
    "register",
    "dashboard",
    "profile"
];

const isValidAlias = (alias: string) =>
    /^[a-zA-Z0-9_-]{3,20}$/.test(alias);

export const createShortUrl = async(
    originalUrl:string,
    userId:number,
    customAlias?:string
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
        return {
            alreadyExists: true,
            url: existingurl
        };
    }

    const alias = customAlias?.trim();

    let shortCode: string;

    if (alias) {

        if (!isValidAlias(alias)) {
            throw new AppError(
                "Alias must contain only letters, numbers, '-' or '_' and be 3-20 characters long.",
                400
            );
        }

        if (
            RESERVED_ALIASES.includes(
                alias.toLowerCase()
            )
        ) {
            throw new AppError(
                "This alias is reserved.",
                400
            );
        }

        const existingAlias =
            await repo.findByShortCode(alias);

        if (existingAlias) {
            throw new AppError(
                "Alias already exists.",
                409
            );
        }

        shortCode = alias;

    } else {

        do {

            shortCode = generateShortCode();

        } while (
            await repo.findByShortCode(shortCode)
        );

    }
    const created = await repo.createUrl(
    shortCode,
    originalUrl,
    userId
);

return {
    alreadyExists: false,
    url: created
};
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

export const updateMyUrl = async (
    shortCode: string,
    originalUrl: string,
    customAlias: string | undefined,
    userId: number
) => {

    const url = await getOwnedUrl(
        shortCode,
        userId
    );

    const alias = customAlias?.trim();

    if (
        url.original_url === originalUrl &&
        (!alias || alias === url.short_code)
    ) {
        throw new AppError(
            "Nothing to update",
            400
        );
    }

    const existingUrl =
        await repo.findByUrlAndUser(
            originalUrl,
            userId
        );

    if (
        existingUrl &&
        existingUrl.id !== url.id
    ) {

        return {
            alreadyExists: true,
            url: existingUrl
        };

    }

    const safety =
        await checkUrlSafety(originalUrl);

    if (!safety.safe) {

        throw new AppError(
            safety.message,
            400
        );

    }

    let finalAlias = url.short_code;

    if (
        alias &&
        alias != url.short_code
    ) {

        if (!isValidAlias(alias)) {
            throw new AppError(
                "Invalid alias",
                400
            );
        }

        if (
            RESERVED_ALIASES.includes(
                alias.toLowerCase()
            )
        ) {
            throw new AppError(
                "Alias is reserved",
                400
            );
        }

        const exists =
            await repo.findByShortCode(alias);

        if (
            exists &&
            exists.id != url.id
        ) {
            throw new AppError(
                "Alias already exists",
                409
            );
        }

        finalAlias = alias;

    }

    const updated =
        await repo.updateUrl(
            shortCode,
            originalUrl,
            finalAlias
        );

    return {

        alreadyExists: false,

        url: updated

    };

};