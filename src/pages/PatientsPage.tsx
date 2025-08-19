import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import PatientSearchBar from "@/components/PatientSearchBar";
import PatientFilters from "@/components/PatientFilters";
import PatientList from "@/components/PatientList";
import { Patient } from "@/components/PatientList";
import { useNavigate } from "react-router-dom";
import PatientRegistrationModal, {
  PatientFormValues,
} from "@/components/PatientRegistrationModal";
import { toast } from "@/components/ui/use-toast";

import { getPatients, addPatient, updatePatient } from "../api/patient";

const PatientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("None");
  const [status, setStatus] = useState("None");
  const [disease, setDisease] = useState("None");
  const [sex, setSex] = useState("None");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddPatientProfile = () => {
    setIsRegistrationModalOpen(true);
  };

  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatient = async (filters) => {
    try {
      const response = await getPatients(filters);
      setPatients(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const filters = {
      disease: "None",
      sex: "None",
      consultlocation: "None",
      treatmentStatus: "None",
      recentAppointmentDate: "None",
    };

    setIsLoading(true);
    fetchPatient(filters);
  }, []);

  const handleSearch = () => {
    // In a real application, this would filter the appointments based on the search query
    toast({
      title: "Search performed",
      description: `Searching for: ${searchQuery}`,
    });
  };

  const applyFilters = () => {
    const filters = {
      disease: disease,
      sex: sex,
      consultlocation: location,
      treatmentStatus: status,
      recentAppointmentDate:
        date === undefined ? "None" : date.toISOString().slice(0, 10),
    };

    setIsLoading(true);
    fetchPatient(filters);
  };

  const clearFilters = () => {
    setLocation("None");
    setStatus("None");
    setDisease("None");
    setSex("None");
    setDate(undefined);

    applyFilters();
  };

  const handleViewDetails = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  const handleSavePatient = async (patientData: PatientFormValues) => {
    const newpatient = {
      name: patientData.name,
      imageURL: "http://google.com",
      age: patientData.age,
      sex: patientData.sex,
      address: patientData.address,
      height: patientData.height,
      weight: patientData.weight,
      phone: patientData.contactNumber,
      email: patientData.email,
      bloodGroup: patientData.bloodGroup,
      dob: patientData.dateOfBirth,
      consultlocation: patientData.location,
      treatmentStatus: "Ongoing",
      registrationDate: new Date().toISOString(),
      recentAppointmentDate: new Date().toISOString(),
    };

    setIsLoading(true);
    const response = await addPatient(newpatient);
    console.log(response);

    setIsLoading(false);
    // Close the modal
    setIsRegistrationModalOpen(false);
  };

  return (
    <div
      className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Patients</h1>

        <div className="space-y-4">
          <PatientSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onMenuToggle={() => setShowFilters(!showFilters)}
            onAddNewPatient={handleAddPatientProfile}
          />

          {showFilters && (
            <PatientFilters
              location={location}
              setLocation={setLocation}
              status={status}
              setStatus={setStatus}
              disease={disease}
              setDisease={setDisease}
              sex={sex}
              setSex={setSex}
              date={date}
              setDate={setDate}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          )}
        </div>
      </div>

      <PatientList
        patients={patients}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
      />

      {/* Patient Registration Modal */}
      <PatientRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default PatientsPage;
