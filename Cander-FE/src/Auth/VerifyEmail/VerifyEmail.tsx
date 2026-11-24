import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

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
import { Input } from "@/components/ui/input";
import { verifyEmailService } from "@/Services/auth.service";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<VerifyFormValues> = async (data) => {
    try {
      const response = await verifyEmailService(data);
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter your email address and the OTP sent to your inbox.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="verify-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.otp}>
            <FieldLabel htmlFor="otp">OTP Code</FieldLabel>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              aria-invalid={!!errors.otp}
              {...register("otp")}
            />
            <FieldError errors={[errors.otp]} />
          </Field>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="verify-form"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
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
