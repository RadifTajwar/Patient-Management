import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { register } from "../api/auth";

// shadcn + react-hook-form + zod
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DoctorRegistrationForm from "@/components/auth/DoctorRegistrationForm";
import { DoctorRegistrationData } from "@/interface/doctor/doctorInterfaces";
import { z } from "zod";

const VALID_PROMO = "123456789";

export const doctorRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .regex(
        /^[A-Za-z.\s]+$/,
        "Name can contain only letters, spaces, and dots"
      ),

    bmdcNumber: z
      .string()
      .trim()
      .length(10, "BMDC must be exactly 10 characters")
      .regex(/^[A-Za-z0-9]+$/, "BMDC must contain only letters and numbers")
      .transform((val) => val.toUpperCase()),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{11}$/, "Phone number must be exactly 11 digits"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((val) => val?.toLowerCase()),

    promoCode: z.string().trim().min(1, "Promo code is required"),

    password: z.string().min(1, "Password is required"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// -------------------- RegisterPage Component --------------------
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<DoctorRegistrationData>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      name: "",
      bmdcNumber: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: DoctorRegistrationData) => {
    console.log("clicking");
    try {
      const VALID_PROMO = "123456789";

      // ✅ Local promo check (optional, to prevent useless backend calls)
      if (data.promoCode !== VALID_PROMO) {
        toast.error("Invalid Promo Code", {
          description: "Please enter a valid promo code to continue.",
        });
        return;
      }

      const payload = {
        name: data.name,
        email: data.email,
        bmdc: data.bmdcNumber,
        phone: data.phone,
        password: data.password,
        promoCode: data.promoCode,
      };

      const response = await register(payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful", {
          description: "Your account has been created.",
        });
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again later.";

      toast.error("Registration failed", {
        description: message,
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Register as a doctor to manage your practice
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormProvider {...form}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Doctor Registration Form Fields */}
                  <DoctorRegistrationForm />

                  <div className="flex justify-between pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/login")}
                    >
                      Back to Login
                    </Button>
                    <Button type="submit">Complete Registration</Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
