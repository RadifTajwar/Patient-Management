import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface Degree {
  degree: string;
  institution: string;
  year: string;
}

interface DoctorInfo {
  name: string;
  specialty: string;
  bmdcNumber: string;
  address: string;
  phone: string;
  email: string;
  degrees: Degree[];
}

interface EditDoctorProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorInfo: DoctorInfo;
  onSave: (updatedInfo: DoctorInfo) => void;
}

const EditDoctorProfileModal: React.FC<EditDoctorProfileModalProps> = ({
  open,
  onOpenChange,
  doctorInfo,
  onSave,
}) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Create a deep copy of doctorInfo to avoid modifying the original
  const [formData, setFormData] = useState<DoctorInfo>({
    ...doctorInfo,
    degrees: JSON.parse(JSON.stringify(doctorInfo.degrees)),
  });

  const form = useForm<DoctorInfo>({
    defaultValues: formData,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (profileImage) {
      toast.success("Profile image updated");
    }

    // ✅ Send formData with degrees array
    onSave({
      ...formData,
      degrees: formData.degrees,
    });

    toast.success("Profile updated successfully");
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof DoctorInfo, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const addDegree = () => {
    const newDegrees = [
      ...formData.degrees,
      { degree: "", institution: "", year: "" },
    ];
    handleInputChange("degrees", newDegrees);
  };

  const updateDegree = (index: number, field: keyof Degree, value: string) => {
    const updatedDegrees = [...formData.degrees];
    updatedDegrees[index] = {
      ...updatedDegrees[index],
      [field]: value,
    };
    handleInputChange("degrees", updatedDegrees);
  };

  const removeDegree = (index: number) => {
    const updatedDegrees = formData.degrees.filter((_, i) => i !== index);
    handleInputChange("degrees", updatedDegrees);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Doctor Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and educational credentials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <FormLabel>Profile Image</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">Dr</span>
                  )}
                </div>
                <label htmlFor="picture" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Upload className="h-4 w-4" />
                    Upload Image
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

            <Separator />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Specialty</FormLabel>
                <FormControl>
                  <Input
                    value={formData.specialty}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>BMDC Number</FormLabel>
                <FormControl>
                  <Input
                    value={formData.bmdcNumber}
                    onChange={(e) =>
                      handleInputChange("bmdcNumber", e.target.value)
                    }
                  />
                </FormControl>
              </FormItem>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>

            <Separator />

            {/* Degrees */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Educational Degrees</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDegree}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Degree
                </Button>
              </div>

              <div className="space-y-4">
                {formData.degrees.map((degree, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Degree {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDegree(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormItem>
                        <FormLabel>Degree/Certificate</FormLabel>
                        <FormControl>
                          <Input
                            value={degree.degree}
                            onChange={(e) =>
                              updateDegree(index, "degree", e.target.value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input
                            value={degree.institution}
                            onChange={(e) =>
                              updateDegree(index, "institution", e.target.value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            value={degree.year}
                            onChange={(e) =>
                              updateDegree(index, "year", e.target.value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-black hover:bg-blue-700" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDoctorProfileModal;
