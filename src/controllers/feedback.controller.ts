import { Request, Response } from "express";
import * as feedbackService from "../services/feedback.service";

export const reportBug = async (
    req: Request,
    res: Response
) => {

    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({
            success: false,
            message: "Email and message are required."
        });
    }

    await feedbackService.reportBug(
        email,
        message
    );

    return res.status(200).json({
        success: true,
        message: "Bug report submitted successfully."
    });

};