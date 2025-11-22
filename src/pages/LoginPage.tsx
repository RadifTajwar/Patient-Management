import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/components/ui/sonner";
import { login } from "../api/auth";

import {
  saveAccessToken,
  saveRefreshToken,
  saveBMDC,
  saveDoctorInfo,
} from "../utils/accessutils";

// Validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // UX Enhancements
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Load last-used email
  useEffect(() => {
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) form.setValue("email", lastEmail);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const response = await login(data);

      if (response.status === 200) {
        toast.success("Login successful!");

        // Save email for next login
        localStorage.setItem("lastEmail", data.email);

        saveAccessToken(response.data.token);
        saveRefreshToken(response.data.refreshToken);
        saveBMDC(response.data.bmdc);
        saveDoctorInfo(response.data.doctorInfo);

        navigate("/appointments");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Invalid email or password";

      toast.error(errorMsg);

      // Trigger shaking animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Full-page overlay loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      )}

      <Card
        className={`w-full max-w-md transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          disabled={loading}
                          {...field}
                          className="pl-10"
                        />
                      </FormControl>
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={loading}
                          {...field}
                          className="pl-10 pr-10"
                        />
                      </FormControl>

                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={loading}
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <div
                  className="p-0 h-auto text-sm cursor-pointer"
                  onClick={() => !loading && navigate("/forgot-password")}
                >
                  Forgot password?
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <div
              className="p-0 cursor-pointer inline-block text-black"
              onClick={() => !loading && navigate("/register")}
            >
              Sign up
            </div>
          </div>
        </CardFooter>
      </Card>

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

export default LoginPage;
