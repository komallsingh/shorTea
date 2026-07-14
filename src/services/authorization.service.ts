import * as repo from "../repo/url.repo";
import { AppError } from "../utils/AppError";

export const getOwnedUrl = async (
    shortCode: string,
    userId: number
) => {
    const url = await repo.findByShortCodeAndUser(
        shortCode,
        userId
    );

    if (!url) {
        throw new AppError(
            "Forbidden",
            403
        );
    }

    return url;
};