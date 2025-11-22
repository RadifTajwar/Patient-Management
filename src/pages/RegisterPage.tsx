import React, { useState } from "react";
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

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import DoctorRegistrationForm from "@/components/auth/DoctorRegistrationForm";
import { DoctorRegistrationData } from "@/interface/doctor/doctorInterfaces";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// SAME VALIDATIONS AS BEFORE
const doctorRegistrationSchema = z
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
      .transform((val) => val.toLowerCase()),

    promoCode: z.string().trim().min(1, "Promo code is required"),

    password: z.string().min(1, "Password is required"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const VALID_PROMO = "123456789";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const form = useForm<DoctorRegistrationData>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      name: "",
      bmdcNumber: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      promoCode: "",
    },
  });

  const onSubmit = async (data: DoctorRegistrationData) => {
    try {
      setLoading(true);

      // Promo code check (local)
      if (data.promoCode !== VALID_PROMO) {
        toast.error("Invalid Promo Code", {
          description: "Please enter a valid promo code to continue.",
        });

        setShake(true);
        setTimeout(() => setShake(false), 500);
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

      // shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      {/* Full-page overlay loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      )}

      <div className="w-full max-w-3xl">
        <Card
          className={`transition-all duration-300 ${
            shake ? "animate-shake" : ""
          }`}
        >
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
                  <DoctorRegistrationForm disabled={loading} />

                  <div className="flex justify-between pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => navigate("/login")}
                    >
                      Back to Login
                    </Button>

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

      {/* Shaking animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
