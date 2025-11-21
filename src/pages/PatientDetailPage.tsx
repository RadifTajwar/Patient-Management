import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientProfileEditModal } from "@/components/PatientProfileEditModal";
import AddAppointmentModal, {
  AppointmentFormData,
} from "@/components/AddAppointmentModal";
import ConsultationDetailsModal from "@/components/ConsultationDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/components/PatientList";
import { getSinglePatient, updatePatient } from "../api/patient";
import { addSingleConsultation, allConsultations } from "../api/consultation";
import { ConsultationInfo } from "@/interface/AllInterfaces";

const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 State
  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<Patient>();
  const [consultations, setConsultations] = useState<ConsultationInfo[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationInfo | null>(null);

  // 🔹 Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] =
    useState<boolean>(false);

  // 🔹 Ref guard (initialize once)
  const refreshFlag = useRef(false);

  interface FetchConsultationsResponse {
    data: ConsultationInfo[];
  }

  // 🔹 Fetch consultations
  const fetchConsultations = async (
    id: number,
    patientId: string | undefined
  ): Promise<void> => {
    try {
      const response: FetchConsultationsResponse = await allConsultations(
        id,
        patientId
      );

      const data = response.data || [];
      const completedConsultations = data?.filter(
        (c) => c?.appointmentStatus?.toLowerCase() === "completed"
      );
      console.log("id and patientId", data);
      setConsultations(data || []);

      if (!refreshFlag.current) {
        console.log("Consultation options initialized once.");
        refreshFlag.current = true;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error",
        description: "Could not fetch consultations.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Fetch patient
  const fetchPatient = async () => {
    try {
      const response = await getSinglePatient({ patientId });
      setPatient(response?.data);
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast({
        title: "Error loading patient",
        description: "Could not fetch patient data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchConsultations(-1, patientId);
  }, [patientId]);

  // 🔹 Add new consultation (appointment)
  const addConsultation = async (data: any) => {
    try {
      const response = await addSingleConsultation(data);
      console.log("Consultation added:", response.data);
      toast({
        title: "Consultation Added",
        description: "New consultation successfully added.",
      });
      fetchConsultations(-1, patientId);
    } catch (error) {
      console.error("Error adding consultation:", error);
      toast({
        title: "Error",
        description: "Failed to add consultation.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Update patient info
  const updateSinglePatient = async (data: any) => {
    try {
      const response = await updatePatient(data);
      console.log("Patient updated:", response.data);
      toast({
        title: "Patient Updated",
        description: "Patient details successfully updated.",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient information.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Handlers
  const handleGoBack = () => navigate("/patients");
  const handleEditProfile = () => setIsEditModalOpen(true);

  const handleSaveAppointment = (appointmentData: AppointmentFormData) => {
    const date = new Date(appointmentData.date);
    const [hours, minutes] = appointmentData.time?.split(":");
    date.setHours(Number(hours), Number(minutes), 0, 0);
    const formattedDate = date.toISOString()?.slice(0, 19).replace("T", " ");

    const data = {
      patientId,
      consultlocation: appointmentData.location,
      consultType: appointmentData.type,
      dateTime: formattedDate,
      patientCondition: appointmentData.condition,
      consultationFee: appointmentData.consultationFee,
      appointmentStatus: "Scheduled",
    };

    addConsultation(data);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    updateSinglePatient(updatedPatient);
    setPatient(updatedPatient);
    setIsEditModalOpen(false);
  };

  const handleViewConsultationDetails = (consultationId: number) => {
    const consultationInfo = consultations?.find(
      (e) => e.id === consultationId
    );

    if (consultationInfo) {
      setSelectedConsultation(consultationInfo);
      setIsConsultationModalOpen(true);
    } else {
      toast({
        title: "Consultation Details",
        description: `Consultation ${consultationId} details not found.`,
        variant: "destructive",
      });
    }
  };

  // 🔹 Helpers
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "new patient":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "follow up":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "special checkup":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      ?.substring(0, 2);

  const processISOString = (date: string) => {
    const year = date?.substring(0, 4);
    const month = date?.substring(5, 7);
    const day = date?.substring(8, 10);
    const time = date?.substring(11, 16);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${day} ${months[Number(month) - 1]}, ${year}  ${time}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[50vh]">
        <p>Loading patient information...</p>
      </div>
    );
  }

  // 🔹 Render
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="">
          <Button
            onClick={handleEditProfile}
            className="bg-blue-600 hover:bg-blue-700 gap-4"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Patient Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(patient?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{patient?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {patient?.sex}, {patient?.age} years
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 🩸 Health Information */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Health Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">
                      Blood Group
                    </p>
                    <p className="text-foreground">
                      {patient?.bloodGroup || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Height</p>
                    <p className="text-foreground">
                      {patient?.height || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Weight</p>
                    <p className="text-foreground">
                      {patient?.weight || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">
                      Last Disease
                    </p>
                    <p className="text-foreground">
                      {patient?.disease || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 📞 Contact Information */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">Phone</p>
                    <p className="text-foreground">{patient?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Email</p>
                    <p className="text-foreground">{patient?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* 📍 Location Information */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Location Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">
                      Preferred Location
                    </p>
                    <p className="text-foreground">
                      {patient?.consultlocation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Address</p>
                    <p className="text-foreground">
                      {patient?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation History */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation History</CardTitle>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <div className="text-center p-4 bg-muted rounded-md">
                <p>No consultation history available.</p>
              </div>
            ) : (
              <ScrollArea
                className={
                  consultations.length > 3 ? "h-80 pr-4" : "max-h-full pr-4"
                }
              >
                <div className="space-y-4">
                  {consultations.map((record) => (
                    <Card key={record.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                            <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
                              {record.date}
                            </span>
                            <Badge
                              className={getStatusColor(
                                record.appointmentStatus
                              )}
                            >
                              {record.appointmentStatus}
                            </Badge>
                            <Badge className={getTypeColor(record.consultType)}>
                              {record.consultType}
                            </Badge>
                          </div>
                          <Button
                            onClick={() =>
                              handleViewConsultationDetails(record.id)
                            }
                            variant="outline"
                            className="self-end md:self-center shrink-0 bg-black hover:bg-blue-700 text-white hover:text-white"
                          >
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {patient && (
        <>
          <PatientProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            patient={patient}
            onSave={handleSavePatient}
          />

          <ConsultationDetailsModal
            isOpen={isConsultationModalOpen}
            onClose={() => setIsConsultationModalOpen(false)}
            consultation={selectedConsultation}
          />
        </>
      )}
    </div>
  );
};

export default PatientDetailPage;
