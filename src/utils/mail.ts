import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBugReport = async (
    userEmail: string,
    message: string
) => {

    const { data, error } = await resend.emails.send({
        from: "shorTea Bug Report <onboarding@resend.dev>",
        to: [
            process.env.BUG_REPORT_EMAIL!
        ],
        subject: "New shorTea Bug Report",

        html: `
            <h2> New Bug Report</h2>

            <p>
                <strong>User Email:</strong>
                ${userEmail}
            </p>

            <p>
                <strong>Message:</strong>
            </p>

            <p>
                ${message}
            </p>
        `,
    });


    if (error) {
        console.error("Resend error:", error);
        throw new Error("Failed to send bug report email");
    }


    console.log("Email sent:", data?.id);
};