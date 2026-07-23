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

    customAlias: z
        .string()
        .trim()
        .min(3, "Alias must be at least 3 characters")
        .max(20, "Alias can be at most 20 characters")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Alias can only contain letters, numbers, '-' and '_'"
        )
        .optional()

});