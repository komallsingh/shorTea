import * as urlRepo from "../repo/url.repo";
import * as analyticsRepo from "../repo/analytic.repo";
import { AppError } from "../utils/AppError";

export const getBrowserStats = async (
    shortCode: string
) => {
    // Find the URL first
    const url = await urlRepo.findByShortCode(shortCode);

    if (!url) {
        throw new AppError(
            "URL not found",
            404
        );
    }

    // Fetch browser statistics
    const browserStats = await analyticsRepo.getBrowserStats(
        url.id
    );

    return browserStats;
};