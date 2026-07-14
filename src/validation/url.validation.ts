import { z } from "zod";

export const createUrlSchema = z.object({
    url: z
        .string()
        .url("Invalid URL")
        .refine(
            (url) =>
                url.startsWith("http://") ||
                url.startsWith("https://"),
            {
                message: "Only HTTP/HTTPS URLs are allowed",
            }
        ),
});