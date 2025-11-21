import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Upload } from "lucide-react";
import { DoctorRegistrationData } from "@/interface/doctor/doctorInterfaces";

const BasicInfoStep: React.FC = () => {
  const { control, setValue, watch } = useFormContext<DoctorRegistrationData>();
  const profileImage = watch("profileImage");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("profileImage", e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Image */}
      <div className="space-y-2">
        <FormLabel>Profile Image</FormLabel>
        <div className="flex items-center space-x-5">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <label htmlFor="picture" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Upload className="h-4 w-4" />
              {profileImage ? "Change Image" : "Upload Image"}
            </div>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Full Name */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Dr. John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Specialty */}
      <FormField
        control={control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialty</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Cardiology, Pediatrics, etc."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BMDC Registration Number */}
      <FormField
        control={control}
        name="bmdcNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>BMDC Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your registration number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
