import * as urlRepo from "../repo/url.repo";
import * as analyticsRepo from "../repo/analytic.repo";
import { AppError } from "../utils/AppError";
import { getOwnedUrl } from "./authorization.service";

export const getBrowserStats = async (
    shortCode: string,
    userId: number
) => {
    const url = await getOwnedUrl(
        shortCode,
        userId
    );

    return await analyticsRepo.getBrowserStats(
        url.id
    );
};

export const getDailyAnalytics = async (
    shortCode: string,
    userId: number
) => {

    const url = await getOwnedUrl(
        shortCode,
        userId
    );

    return await analyticsRepo.getDailyClickStats(
        url.id
    );

};