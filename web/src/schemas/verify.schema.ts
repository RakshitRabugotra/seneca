import { z } from "zod";

export const verifySchema = z.object({
    code: z.string().length(5, "Verification code must conatin only 5 digits"),
});
