import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientProfileEditModal } from "@/components/PatientProfileEditModal";
import AddAppointmentModal, {
  AppointmentFormData,
} from "@/components/AddAppointmentModal";
import ConsultationDetailsModal from "@/components/ConsultationDetailsModal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/components/PatientList";
import { getSinglePatient, updatePatient } from "../api/patient";
import { addSingleConsultation, allConsultations } from "../api/consultation";
import { ConsultationInfo } from "../pages/ConsultationPage";

interface ConsultationRecord {
  id: string;
  date: string;
  doctorName: string;
  disease: string;
  diagnosis: string;
  prescription: string;
  consultationType: string;
  notes: string;
}

const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<Patient>();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState<boolean>(false);
  const [selectedConsultation, setSelectedConsultation] =useState<ConsultationInfo | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] =useState<boolean>(false);

  const [consultations, setConsultations] = useState<ConsultationInfo[]>([]);

  interface FetchConsultationsResponse {
    data: ConsultationInfo[];
  }

  const fetchConsultations = async (
    id: number,
    patientId: string | undefined
  ): Promise<void> => {
    try {
      const response: FetchConsultationsResponse = await allConsultations(id, patientId);
      console.log(response.data);
      setConsultations(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching consultations:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getSinglePatient({ patientId: patientId });
        console.log(response?.data);
        setPatient(response?.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchPatient();
    fetchConsultations(-1, patientId);

    //setLoading(false);
  }, []);

  const addConsultation = async (data) => {
    try {
      const response = await addSingleConsultation(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const updateSinglePatient = async (data) => {
    try {
      const response = await updatePatient(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/patients");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleAddAppointment = () => {
    setIsAddAppointmentModalOpen(true);
  };

  const handleSaveAppointment = (appointmentData: AppointmentFormData) => {
    let date = appointmentData.date.toISOString();
    date = date.replace("18:00", appointmentData.time);

    const data = {
      patientId: patientId,
      consultlocation: appointmentData.location,
      consultType: appointmentData.type,
      dateTime: date,
      patientCondition: appointmentData.condition,
      consultationFee: appointmentData.consultationFee,
      appointmentStatus: "Scheduled",
    };

    addConsultation(data);

    setIsAddAppointmentModalOpen(false);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    updateSinglePatient(updatedPatient);
    setPatient(updatedPatient);
    setIsEditModalOpen(false);
  };

  const handleViewConsultationDetails = (consultationId: number) => {
    const consultationInfo = consultations?.find((e) => e.id === consultationId);
   
    if (consultationInfo) {
      setSelectedConsultation(consultationInfo);
      setIsConsultationModalOpen(true);
    } else {
      console.log("Consultation not found:", consultationId);
      toast({
        title: "Consultation Details",
        description: `Consultation ${consultationId} details not found.`,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const processISOString = (date: string) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const time = date.substring(11, 16);

    let monthName = "";
    switch (month) {
      case "01":
        monthName = "January";
        break;
      case "02":
        monthName = "February";
        break;
      case "03":
        monthName = "March";
        break;
      case "04":
        monthName = "April";
        break;
      case "05":
        monthName = "May";
        break;
      case "06":
        monthName = "June";
        break;
      case "07":
        monthName = "July";
        break;
      case "08":
        monthName = "August";
        break;
      case "09":
        monthName = "September";
        break;
      case "10":
        monthName = "October";
        break;
      case "11":
        monthName = "November";
        break;
      case "12":
        monthName = "December";
        break;
    }

    const dateFormat = day + " " + monthName + ", " + year + "  " + time;

    return dateFormat;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[50vh]">
        <p>Loading patient information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="grid md:grid-cols-3 lg:grid-cols-2 gap-4">
          <Button
            onClick={handleAddAppointment}
            className="bg-blue-600 hover:bg-blue-700 col-span-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Appointment
          </Button>
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
                {/* <AvatarImage
                  src={`https://source.unsplash.com/random/100x100/?portrait&${patient?.id}`}
                  alt={patient?.name}
                /> */}
                <AvatarFallback className="text-lg">
                  {getInitials(patient?.name)}
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </p>
                    <p>{patient?.dob ? processISOString(typeof patient.dob === "string" ? patient.dob : patient.dob.toISOString()) : ""}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Blood Group
                    </p>
                    <p>{patient?.bloodGroup}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Height
                    </p>
                    <p>{patient.height}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p>{patient?.weight}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-1">{patient?.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1">{patient?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Preferred Location
                  </p>
                  <p className="mt-1">{patient?.consultlocation}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1">{patient?.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation History Card */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation History</CardTitle>
          </CardHeader>
          <CardContent>
            {consultations?.length === 0 ? (
              <div className="text-center p-4 bg-muted rounded-md">
                <p>No consultation history available.</p>
              </div>
            ) : (
              <ScrollArea
                className={
                  consultations?.length > 3 ? "h-80 pr-4" : "max-h-full pr-4"
                }
              >
                <div className="space-y-4">
                  {consultations?.map((record) => (
                    <Card key={record?.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                            <div className="space-y-1">
                              <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
                                {processISOString(record?.dateTime)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                {record?.disease}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <Badge
                                className={getStatusColor(
                                  record?.appointmentStatus
                                )}
                              >
                                {record?.appointmentStatus}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <Badge
                                className={getTypeColor(record?.consultType)}
                              >
                                {record?.consultType}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              handleViewConsultationDetails(record?.id)
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

          <AddAppointmentModal
            isOpen={isAddAppointmentModalOpen}
            onClose={() => setIsAddAppointmentModalOpen(false)}
            patientName={patient.name}
            onSave={handleSaveAppointment}
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
