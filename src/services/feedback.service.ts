import { AppError } from "../utils/AppError";
import { sendBugReport } from "../utils/mail";
import { findById } from "../repo/auth.repo";

export const reportBugService = async (
    userId: number,
    message: string
) => {

    const user = await findById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    await sendBugReport(
        user.email,
        message
    );
};