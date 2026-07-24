import { sendBugReport } from "../utils/mail";

export const reportBug = async (
    email: string,
    message: string
) => {

    await sendBugReport(
        email,
        message
    );

};