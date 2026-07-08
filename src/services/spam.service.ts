import axios from "axios";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError";

dotenv.config();

interface SafetyResult {
    safe: boolean;
    threats?: ThreatType[];
    provider: string;
    message: string;
}

type ThreatType =
    | "MALWARE"
    | "SOCIAL_ENGINEERING"
    | "UNWANTED_SOFTWARE";

const PROVIDER = "Google Safe Browsing";

const threatMessages: Record<ThreatType, string> = {
    MALWARE: "This URL contains malware.",
    SOCIAL_ENGINEERING: "This URL is a phishing website.",
    UNWANTED_SOFTWARE: "This URL distributes unwanted software.",
};

export const checkUrlSafety = async (
    url: string
): Promise<SafetyResult> => {

    if (!process.env.GOOGLE_SAFE_APIKEY) {
        throw new AppError(
            "Google Safe Browsing API key is not configured.",
            500
        );
    }

    try {

        const apiUrl =
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_APIKEY}`;

        const body = {
            client: {
                clientId: "url-shortener",
                clientVersion: "1.0.0",
            },
            threatInfo: {
                threatTypes: [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE",
                ],
                platformTypes: [
                    "ANY_PLATFORM",
                ],
                threatEntryTypes: [
                    "URL",
                ],
                threatEntries: [
                    {
                        url,
                    },
                ],
            },
        };

        const response = await axios.post(
            apiUrl,
            body,
            {
                timeout: 5000,
            }
        );
        console.log(response.data);
        const matches = response.data.matches;

        // Safe URL
        if (!matches || matches.length === 0) {
            return {
                safe: true,
                provider: PROVIDER,
                message: "URL is safe.",
            };
        }

        // Extract all detected threats
        const threats: ThreatType[] = matches.map(
            (match: any) => match.threatType as ThreatType
        );

        // Create readable message
        const messages = threats.map(
            threat => threatMessages[threat]
        );

        return {
            safe: false,
            provider: PROVIDER,
            threats,
            message: messages.join(" "),
        };

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error(
                "Google Safe Browsing Error:",
                error.response?.data || error.message
            );
        } else {
            console.error(error);
        }

        throw new AppError(
            "Unable to verify URL safety. Please try again later.",
            503
        );
    }
};