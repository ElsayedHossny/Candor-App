import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

import { Controller } from "react-hook-form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  verifySchema,
  type VerifyFormValues,
} from "@/schemas/auth/verifyEmail.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { resendOtpService, verifyEmailService } from "@/Services/auth.service";
import { EmailContext } from "@/Context/auth.context";
import { useContext, useEffect, useState } from "react";

export default function VerifyEmail() {
  const emailContext = useContext(EmailContext);
  if (!emailContext) {
    throw new Error("EmailContext is not provided");
  }
  const { emailReg } = emailContext;

  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailReg,
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<VerifyFormValues> = async (data) => {
    try {
      const allData = { email: emailReg, otp: data.otp };

      const response = await verifyEmailService(allData);
      console.log("Verify Response:", response);
      toast.success("Email verified successfully!");

      navigate("/login");
    } catch (error) {
      console.log("Errorororo", data);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Verification failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const ResendOTP = async () => {
    try {
      setIsResending(true);
      const response = await resendOtpService({ email: emailReg });
      toast.success(response.message || "OTP sent successfully!");

      setCountdown(60);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>{emailReg}</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center">
        <form
          id="verify-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field
            data-invalid={!!errors.otp}
            className="flex flex-col items-center justify-center gap-3"
          >
            <FieldLabel htmlFor="otp" className="justify-center">
              OTP Code
            </FieldLabel>

            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  id="otp"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="rounded-md border"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            <FieldError errors={[errors.otp]} />
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="verify-form"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </Button>
        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={ResendOTP}
          disabled={isResending || countdown > 0 || !emailReg}
        >
          {isResending
            ? "Sending..."
            : countdown > 0
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Already verified?{" "}
          <Link to="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
