import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { DoctorRegistrationData } from "@/interface/doctor/doctorInterfaces";

const DoctorRegistrationForm: React.FC = () => {
  const { control } = useFormContext<DoctorRegistrationData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClasses = "focus:outline-none focus:ring-0";

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <FormField
        control={control}
        name="name"
        rules={{ required: "Full name is required" }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Full Name <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Dr. John Doe"
                {...field}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* BMDC Registration Number */}
      <FormField
        control={control}
        name="bmdcNumber"
        rules={{ required: "BMDC registration number is required" }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              BMDC Registration Number <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your registration number"
                {...field}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Mobile Number */}
      <FormField
        control={control}
        name="phone"
        rules={{ required: "Mobile number is required" }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Mobile Number <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="01712345678"
                {...field}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Email Address <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="doctor@example.com"
                {...field}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Promo Code */}
      <FormField
        control={control}
        name="promoCode"
        rules={{ required: "Promo code is required" }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Promo Code <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter your promo code"
                {...field}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Password <span className="text-red-600">*</span>
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...field}
                  className={`${
                    fieldState.error ? "border-red-500" : ""
                  } ${inputClasses}`}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={control}
        name="confirmPassword"
        rules={{ required: "Please confirm your password" }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Confirm Password <span className="text-red-600">*</span>
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...field}
                  className={`${
                    fieldState.error ? "border-red-500" : ""
                  } ${inputClasses}`}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DoctorRegistrationForm;
