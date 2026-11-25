import axios from "axios";
import type { LoginFormValues } from "@/schemas/auth/login.schema";
import type { RegisterFormValues } from "@/schemas/auth/register.schema";
import type { VerifyFormValues } from "@/schemas/auth/verifyEmail.schema";

const BaseUrl = "http://localhost:3000/api";

export const RegisterService = async (data: RegisterFormValues) => {
  const response = await axios.post(`${BaseUrl}/auth/signup`, data);
  return response.data;
};

export const loginService = async (data: LoginFormValues) => {
  const response = await axios.post(`${BaseUrl}/auth/signin`, data);
  return response.data;
};

export const verifyEmailService = async (data: VerifyFormValues) => {
  const response = await axios.patch(`${BaseUrl}/auth/verify-email`, data);

  return response.data;
};

export const resendOtpService = async ({ email }: { email: string }) => {
  const response = await axios.post(`${BaseUrl}/auth/resetOTP`, {
    email,
  });

  return response.data;
};
