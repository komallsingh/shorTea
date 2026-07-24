import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendBugReport = async (
    userEmail: string,
    message: string
) => {
    console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_PASS =", process.env.MAIL_PASS ? "Loaded" : "Missing");
    await transporter.sendMail({
        from: `"shorTea Bug Report" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: "New Bug Report - shorTea",
        html: `
            <h2>New Bug Report</h2>

            <p><strong>User Email:</strong> ${userEmail}</p>

            <p><strong>Description:</strong></p>

            <p>${message}</p>
        `,
    });

};