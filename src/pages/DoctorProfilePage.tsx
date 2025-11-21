import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Edit,
  FileText,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EditDoctorProfileModal from "@/components/EditDoctorProfileModal";
import { doctorProfile, updateDoctorProfile } from "../api/auth";
import { getBMDC } from "../utils/accessutils";
import { toast } from "@/components/ui/sonner";
import Spinner from "../components/Spinner";

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

const getInitials = (name: string) => {
  return name
    ?.split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    ?.substring(0, 2);
};

// Helper to safely show value or "Not provided"
const safeValue = (value: any) => {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  return "Not provided";
};
const DoctorProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>(null);

  const fetchDoctorProfile = async () => {
    try {
      const response = await doctorProfile();
      console.log("response", response);
      if (response.status === 200 || response.status === 201) {
        const degrees: Degree[] = response.data.degrees || [];

        const data: DoctorInfo = {
          name: response.data.name || "",
          specialty: response.data.specialty || "",
          bmdcNumber: getBMDC(),
          address: response.data.address || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          degrees,
        };

        setDoctorInfo(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching doctor profile: ", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDoctorProfile();
  }, []);

  const handleProfileUpdate = async (updatedInfo: DoctorInfo) => {
    setIsLoading(true);

    const data = {
      name: updatedInfo.name,
      email: updatedInfo.email,
      imageURL: "",
      specialty: updatedInfo.specialty,
      address: updatedInfo.address,
      phone: updatedInfo.phone,
      degrees: updatedInfo.degrees, // ✅ structured array
    };

    try {
      const response = await updateDoctorProfile(data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Doctor Profile Updated successfully");
      }

      setDoctorInfo(updatedInfo);
    } catch (error) {
      console.error("Error updating doctor profile: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Profile</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-28 w-28">
              <AvatarFallback className="text-2xl">
                {getInitials(doctorInfo.name || "Dr")}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">
                  {safeValue(doctorInfo.name)}
                </h2>
                <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  {safeValue(doctorInfo.specialty)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>BMDC: {safeValue(doctorInfo.bmdcNumber)}</span>
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{safeValue(doctorInfo.email)}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{safeValue(doctorInfo.phone)}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{safeValue(doctorInfo.address)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Educational Degrees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doctorInfo.degrees.length > 0 ? (
            <ul className="space-y-4">
              {doctorInfo.degrees.map((degree, index) => (
                <li key={index} className="space-y-1">
                  <div className="font-medium">{safeValue(degree.degree)}</div>
                  <div className="text-sm text-muted-foreground">
                    {safeValue(degree.institution)}, {safeValue(degree.year)}
                  </div>
                  {index < doctorInfo.degrees.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No Educational Degrees provided
            </p>
          )}
        </CardContent>
      </Card>

      <EditDoctorProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        doctorInfo={doctorInfo}
        onSave={handleProfileUpdate}
      />
    </div>
  );
};

export default DoctorProfilePage;
