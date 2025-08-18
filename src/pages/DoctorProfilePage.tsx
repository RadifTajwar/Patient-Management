import React, { useEffect } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Award,
  Edit,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EditDoctorProfileModal from "@/components/EditDoctorProfileModal";
import { useState } from "react";
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
  consultationLocations: string[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const DoctorProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoctorProfile = async () => {
    try {
      const response = await doctorProfile();
      if (response.status === 200 || response.status === 201) {
        const credentials = response.data.affiliation.split("/n");
        const degrees = [];
        for (const creds of credentials) {
          const cred = creds.split("\\n");
          const degree = {
            degree: cred[0],
            institution: cred[1],
            year: cred[2],
          };

          degrees.push(degree);
        }

        const data = {
          name: response.data.name,
          specialty: response.data.specialty,
          bmdcNumber: getBMDC(),
          address: response.data.address,
          phone: response.data.phone,
          email: response.data.email,
          degrees: degrees,
          consultationLocations: response.data.consultlocation.split("\\n"),
        };

        setDoctorInfo(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching doctor profile: ", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDoctorProfile();
  }, []);

  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>(null);

  const handleProfileUpdate = async (updatedInfo: DoctorInfo) => {
    setIsLoading(true);
    let affiliations = "";
    for (const degree of updatedInfo.degrees) {
      affiliations +=
        degree.degree + "\n" + degree.institution + "\n" + degree.year + "/n";
    }

    let consultations = "";
    for (const location of updatedInfo.consultationLocations) {
      consultations += location + "\n";
    }

    const data = {
      name: updatedInfo.name,
      email: updatedInfo.email,
      imageURL: "http://google.com",
      specialty: updatedInfo.specialty,
      address: updatedInfo.address,
      phone: updatedInfo.phone,
      affiliation: affiliations,
      consultlocation: consultations,
    };

    try {
      const response = await updateDoctorProfile(data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Doctor Profile Updated successfully");
      }

      setIsLoading(false);
      setDoctorInfo(updatedInfo);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating doctor profile: ", error);
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
              {/* <AvatarImage
                src={`https://source.unsplash.com/random/100x100/?portrait`}
                alt={doctorInfo.name}
              /> */}
              <AvatarFallback className="text-2xl">
                {getInitials(doctorInfo.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{doctorInfo.name}</h2>
                <p className="text-lg text-muted-foreground">
                  {doctorInfo.specialty}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>BMDC: {doctorInfo.bmdcNumber}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{doctorInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{doctorInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{doctorInfo.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {doctorInfo.degrees.map((degree, index) => (
                <li key={index} className="space-y-1">
                  <div className="font-medium">{degree.degree}</div>
                  <div className="text-sm text-muted-foreground">
                    {degree.institution}, {degree.year}
                  </div>
                  {index < doctorInfo.degrees.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Consultation Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <ul className="list-disc pl-5 space-y-1">
                  {doctorInfo.consultationLocations.map((location, index) => (
                    <li key={index} className="text-sm">
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
