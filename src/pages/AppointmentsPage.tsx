import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AppointmentSearchBar from "@/components/AppointmentSearchBar";
import AppointmentFilters from "@/components/AppointmentFilters";
import AppointmentList, { Appointment } from "@/components/AppointmentList";
import DeleteAppointmentModal from "@/components/DeleteAppointmentModal";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import { getAppointments, cancelAppointment } from "../api/consultation";
import { useNavigate } from "react-router-dom";

const AppointmentsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("None");
  const [status, setStatus] = useState("None");
  const [type, setType] = useState("None");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentIdtoDelete, setAppointmentIdtoDelete] = useState(-1);
  const [patientNametoDelete, setPatientNametoDelete] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const fetchAppointments = async (filters) => {
    try {
      const response = await getAppointments(filters);
      setAppointments(response.data);
     
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filters = {
      consultlocation: "None",
      consultType: "None",
      dateTime: new Date().toISOString().slice(0, 10),
      appointmentStatus: "None",
    };

    setIsLoading(true);
    fetchAppointments(filters);
  }, []);

  const handleSearch = () => {
    if (!searchQuery || searchQuery.trim() === "") return;

    const filtered = appointments.filter((person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setAppointments(filtered);
  };

  const applyFilters = () => {
    const filters = {
      consultlocation: location,
      consultType: type,
      dateTime: date === undefined ? "None" : date.toISOString().slice(0, 10),
      appointmentStatus: status,
    };

    setIsLoading(true);
    fetchAppointments(filters);
  };

  const clearFilters = () => {
    setLocation("None");
    setStatus("None");
    setType("None");
    setDate(undefined);

    const filters = {
      consultlocation: location,
      consultType: type,
      dateTime: date === undefined ? "None" : date.toISOString().slice(0, 10),
      appointmentStatus: status,
    };

    setIsLoading(true);
    fetchAppointments(filters);
  };

  const handleStartAppointment = (id: number) => {
    const appointment = appointments.find((e) => e.id === id);

    setSelectedAppointment(appointment);
    setIsPatientModalOpen(true);
  };

  const handleStartConsultation = (id: number) => {
    setIsPatientModalOpen(false);

    navigate(`/consultation/${id}`, {
      state: selectedAppointment,
    });
  };

  const handleDeleteAppointment = (id: number) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (appointment) {
      setAppointmentIdtoDelete(id);
      setPatientNametoDelete(appointment.name);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteAppointment = async (id: number) => {
    setIsLoading(true);
    const response = await cancelAppointment(id);
    setIsLoading(false);
    if (response.status === 200) {
      setAppointments(appointments.filter((apt) => apt.id !== id));
    }

    setAppointmentIdtoDelete(-1);
    setPatientNametoDelete("");
  };

  return (
    <div className="container mx-auto py-8 px-4 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>

        <div className="space-y-4">
          <AppointmentSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onMenuToggle={() => setShowFilters(!showFilters)}
          />

          {showFilters && (
            <AppointmentFilters
              location={location}
              setLocation={setLocation}
              status={status}
              setStatus={setStatus}
              type={type}
              setType={setType}
              date={date}
              setDate={setDate}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          )}
        </div>
      </div>

      <AppointmentList
        appointments={appointments}
        onStartAppointment={handleStartAppointment}
        onDeleteAppointment={handleDeleteAppointment}
        isLoading={isLoading}
      />

      <PatientDetailsModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        appointment={selectedAppointment}
        onStartConsultation={handleStartConsultation}
      />

      <DeleteAppointmentModal
        isOpen={isDeleteModalOpen}
        appointmentId={appointmentIdtoDelete}
        patientName={patientNametoDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAppointmentIdtoDelete(-1);
          setPatientNametoDelete("");
        }}
        onConfirmDelete={confirmDeleteAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
