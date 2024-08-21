import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(1, "Password is required"),
  identifier: z
      .string()
      .min(1, "Username is required")
      .regex(/^\S*$/, "Spaces not allowed"),
  password: z.string().min(1, "Password is required"),
});
