import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorRegistrationData } from "@/pages/RegisterPage";
import { Upload, User } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  specialty: z.string().min(2, { message: "Specialty is required" }),
  bmdcNumber: z
    .string()
    .min(2, { message: "BMDC registration number is required" }),
});

interface BasicInfoStepProps {
  formData: DoctorRegistrationData;
  updateFormData: (data: Partial<DoctorRegistrationData>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      specialty: formData.specialty,
      bmdcNumber: formData.bmdcNumber,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ profileImage: e.target.files[0] });
    }
  };

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="space-y-2">
          <FormLabel>Profile Image</FormLabel>
          <div className="flex items-center space-x-5">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
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
                {formData.profileImage ? "Change Image" : "Upload Image"}
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

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
          name="bmdcNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BMDC Registration Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your registration number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default BasicInfoStep;
