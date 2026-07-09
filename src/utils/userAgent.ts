import { UAParser } from "ua-parser-js";

interface ParsedUserAgent {
    browser: string;
    os: string;
    device: string;
}

const UNKNOWN = "Unknown";
const DEFAULT_DEVICE = "Desktop";

export const parseUserAgent= (userAgentString: string): ParsedUserAgent =>{
    const parser = new UAParser(userAgentString);
    const result=parser.getResult();
    const browser=result.browser.name ?? UNKNOWN;
    const os = result.os.name ?? UNKNOWN;
    const device = result.device.type ?? DEFAULT_DEVICE;
    return {
        browser,
        os,
        device
    };
};