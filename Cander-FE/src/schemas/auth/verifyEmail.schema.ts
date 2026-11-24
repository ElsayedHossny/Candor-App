import { z } from "zod";

export const verifySchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyFormValues = z.infer<typeof verifySchema>;
