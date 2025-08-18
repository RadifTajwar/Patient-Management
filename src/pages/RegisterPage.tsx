import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import BasicInfoStep from "@/components/registration/BasicInfoStep";
import ContactInfoStep from "@/components/registration/ContactInfoStep";
import EducationStep from "@/components/registration/EducationStep";
import PracticeInfoStep from "@/components/registration/PracticeInfoStep";
import PasswordStep from "@/components/registration/PasswordStep";
import StepIndicator from "@/components/registration/StepIndicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { register } from "../api/auth";

export interface Degree {
  degree: string;
  institution: string;
  year: string;
}

export interface DoctorRegistrationData {
  // Basic Info
  name: string;
  specialty: string;
  bmdcNumber: string;
  profileImage: File | null;

  // Contact Info
  email: string;
  phone: string;
  address: string;

  // Education
  degrees: Degree[];

  // Practice Info
  consultationLocations: string[];

  // Password
  password: string;
  confirmPassword: string;
}

const STEPS = [
  { name: "Basic Info", description: "Personal Details" },
  { name: "Contact", description: "Contact Information" },
  { name: "Credentials", description: "Professional Qualifications" },
  { name: "Practice", description: "Work Information" },
  { name: "Password", description: "Create Password" },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DoctorRegistrationData>({
    name: "",
    specialty: "",
    bmdcNumber: "",
    profileImage: null,
    email: "",
    phone: "",
    address: "",
    degrees: [{ degree: "", institution: "", year: "" }],
    consultationLocations: [""],
    password: "",
    confirmPassword: "",
  });

  const updateFormData = (data: Partial<DoctorRegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    let affiliations = "";
    for (const degree of formData.degrees) {
      affiliations +=
        degree.degree + "\n" + degree.institution + "\n" + degree.year + "/n";
    }

    let consultations = "";
    for (const location of formData.consultationLocations) {
      consultations += location + "\n";
    }

    const data = {
      name: formData.name,
      email: formData.email,
      imageURL: "http://google.com",
      bmdc: formData.bmdcNumber,
      specialty: formData.specialty,
      address: formData.address,
      phone: formData.phone,
      affiliation: affiliations,
      consultlocation: consultations,
      password: formData.password,
    };

    const response = await register(data);
    if (response.status === 200 || response.status === 201) {
      toast.success("Registration successful", {
        description: "Your account has been created.",
      });
      navigate("/login");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep formData={formData} updateFormData={updateFormData} />
        );
      case 1:
        return (
          <ContactInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <EducationStep formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <PracticeInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <PasswordStep formData={formData} updateFormData={updateFormData} />
        );
      default:
        return null;
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
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <div className="mt-8">{renderStep()}</div>

            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
                  Complete Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
