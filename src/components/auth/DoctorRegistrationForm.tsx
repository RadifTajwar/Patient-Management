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

// ⬅ Accept disabled as a prop
interface DoctorRegistrationFormProps {
  disabled?: boolean;
}

const DoctorRegistrationForm: React.FC<DoctorRegistrationFormProps> = ({
  disabled = false,
}) => {
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
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Full Name <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Dr. John Doe"
                {...field}
                disabled={disabled}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BMDC Number */}
      <FormField
        control={control}
        name="bmdcNumber"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              BMDC Registration Number <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your registration number"
                {...field}
                disabled={disabled}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mobile Number */}
      <FormField
        control={control}
        name="phone"
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
                disabled={disabled}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="email"
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
                disabled={disabled}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Promo Code */}
      <FormField
        control={control}
        name="promoCode"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Promo Code <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your promo code"
                {...field}
                disabled={disabled}
                className={`${
                  fieldState.error ? "border-red-500" : ""
                } ${inputClasses}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={control}
        name="password"
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
                  disabled={disabled}
                  className={`${
                    fieldState.error ? "border-red-500" : ""
                  } ${inputClasses}`}
                />
              </FormControl>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
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

            <FormMessage />
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={control}
        name="confirmPassword"
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
                  disabled={disabled}
                  className={`${
                    fieldState.error ? "border-red-500" : ""
                  } ${inputClasses}`}
                />
              </FormControl>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
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

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DoctorRegistrationForm;
