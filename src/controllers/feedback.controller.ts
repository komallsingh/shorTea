import { Request, Response } from "express";
import { reportBugService } from "../services/feedback.service";

export const reportBug = async (
    req: Request,
    res: Response
) => {

    const userId = req.user.id;
    const { message } = req.body;

    if (!message?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message is required."
        });
    }

    reportBugService(
        userId,
        message
    ).catch(error => {
        console.error("Bug report email failed:", error);
    });

    return res.status(200).json({
        success: true,
        message: "Bug report submitted successfully."
    });
};