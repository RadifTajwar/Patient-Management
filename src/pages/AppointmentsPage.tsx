import React, { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Components
import AppointmentSearchBar from "@/components/AppointmentSearchBar";
import AppointmentFilters from "@/components/AppointmentFilters";
import AppointmentList, { Appointment } from "@/components/AppointmentList";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import DeleteAppointmentModal from "@/components/DeleteAppointmentModal";

// API
import {
  getAppointments,
  cancelAppointment,
  getSingleAppointment,
  updateConsultation,
} from "@/api/consultation";

// Interfaces
interface LocationOption {
  id: number | string;
  name: string;
}
interface SlotTimeOption {
  id: number | string;
  name: string;
}
interface TypeOption {
  id: number | string;
  name: string;
}

const AppointmentsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // 🧭 Helper to format local date (no UTC offset)
  const formatLocalDate = (date: Date): string => {
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 🔹 State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [location, setLocation] = useState("None");
  const [status, setStatus] = useState("None");
  const [type, setType] = useState("None");
  const [slotTime, setSlotTime] = useState("None");
  const [date, setDate] = useState<Date>(new Date()); // ✅ Default to today

  // Filter options
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([
    { id: "None", name: "None" },
  ]);
  const [slotTimeOptions, setSlotTimeOptions] = useState<SlotTimeOption[]>([
    { id: "None", name: "None" },
  ]);
  const [typeOptions, setTypeOptions] = useState<TypeOption[]>([
    { id: "None", name: "None" },
  ]);

  // 🔹 Modals
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(-1);
  const [patientNameToDelete, setPatientNameToDelete] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false); // to trigger one-time dropdown population
  // 🔹 Fetch appointments
  const fetchAppointments = async (filters?: any) => {
    setIsLoading(true);

    try {
      const effectiveFilters = filters ?? {
        consultlocation: location,
        consultType: type,
        slotTime,
        dateTime: date ? formatLocalDate(date) : "None",
        appointmentStatus: status,
        search: searchQuery,
      };

      // ✅ Fetch appointments from backend
      const response = await getAppointments(effectiveFilters);
      const data = response.data || [];

      // ✅ Store appointments
      setAppointments(data);

      // 🧠 Only extract and set dropdown options once
      if (!refreshFlag) {
        console.log("refreshFlag is", refreshFlag);
        const locMap = new Map<number, string>();
        const slotMap = new Map<number, string>();
        const typeSet = new Set<string>();

        data.forEach((apt: any) => {
          // Locations
          if (apt.consultLocationId && apt.consultLocationName)
            locMap.set(apt.consultLocationId, apt.consultLocationName);

          // Slot times
          if (apt.timeSlotId && apt.slotTime)
            slotMap.set(apt.timeSlotId, apt.slotTime);

          // Consultation types
          if (apt.consultType && apt.consultType !== "Not Given")
            typeSet.add(apt.consultType);
        });

        // ✅ Set dropdowns once
        setLocationOptions([
          { id: "None", name: "None" },
          ...Array.from(locMap.entries()).map(([id, name]) => ({ id, name })),
        ]);

        setSlotTimeOptions([
          { id: "None", name: "None" },
          ...Array.from(slotMap.entries()).map(([id, name]) => ({ id, name })),
        ]);

        setTypeOptions([
          { id: "None", name: "None" },
          ...Array.from(typeSet).map((type) => ({
            id: type,
            name: type,
          })),
        ]);

        setRefreshFlag(true); // ✅ Prevent repeated updates
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error loading appointments",
        description: "Could not fetch appointment data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce(
        (
          query: string,
          loc: string,
          stat: string,
          typ: string,
          slot: string,
          date?: Date
        ) => {
          fetchAppointments({
            consultlocation: loc,
            consultType: typ,
            slotTime: slot,
            dateTime: date ? formatLocalDate(date) : "None",
            appointmentStatus: stat,
            search: query,
          });
        },
        400
      ),
    []
  );

  // 🔹 Effect: load & search
  useEffect(() => {
    debouncedFetch(searchQuery, location, status, type, slotTime, date);
    return () => debouncedFetch.cancel();
  }, [searchQuery, location, status, type, slotTime, date, debouncedFetch]);

  // 🔹 Filter controls
  const applyFilters = () => {
    debouncedFetch(searchQuery, location, status, type, slotTime, date);
  };

  const clearFilters = () => {
    setLocation("None");
    setStatus("None");
    setType("None");
    setSlotTime("None");
    setDate(new Date()); // ✅ Reset to today's date
    setSearchQuery("");
    debouncedFetch("", "None", "None", "None", "None", new Date());
  };

  // 🔹 Confirm appointment (open modal)
  const handleConfirmAppointment = async (id: number) => {
    try {
      const { data } = await getSingleAppointment(id);
      setSelectedAppointment(data);
      setIsPatientModalOpen(true);
    } catch {
      toast({
        title: "Error fetching appointment",
        description: "Failed to load appointment details.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Update appointment
  const handleUpdateAppointment = async (
    id: number,
    updatedData: Partial<Appointment>
  ) => {
    try {
      const data = { id, ...updatedData };
      await updateConsultation(data);
      toast({
        title: "Appointment Updated",
        description: "The appointment was successfully updated.",
      });
      fetchAppointments();
    } catch {
      toast({
        title: "Update Failed",
        description: "Could not update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Start consultation (after confirmation)
  const handleStartConsultation = (id: number) => {
    setIsPatientModalOpen(false);
    toast({
      title: "Consultation Started",
      description: `You’ve confirmed consultation for appointment #${id}.`,
    });
    fetchAppointments();
  };

  // 🔹 Delete appointment
  const handleDeleteAppointment = (id: number) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (appointment) {
      setAppointmentIdToDelete(id);
      setPatientNameToDelete(appointment.name);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteAppointment = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await cancelAppointment(id);
      if (response.status === 200) {
        setAppointments((prev) => prev.filter((apt) => apt.id !== id));
        toast({
          title: "Appointment Cancelled",
          description: `Appointment for ${patientNameToDelete} has been cancelled.`,
        });
      }
    } catch {
      toast({
        title: "Failed to Cancel",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAppointmentIdToDelete(-1);
      setPatientNameToDelete("");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>

        <div className="space-y-4">
          <AppointmentSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() =>
              debouncedFetch(
                searchQuery,
                location,
                status,
                type,
                slotTime,
                date
              )
            }
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
              slotTime={slotTime}
              setSlotTime={setSlotTime}
              date={date}
              setDate={setDate}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              locationOptions={locationOptions}
              slotTimeOptions={slotTimeOptions}
              typeOptions={typeOptions}
            />
          )}
        </div>
      </div>

      {/* 🩺 Appointment List */}
      <AppointmentList
        appointments={appointments}
        onConfirmAppointment={handleConfirmAppointment}
        handleUpdateAppointment={handleUpdateAppointment}
        onDeleteAppointment={handleDeleteAppointment}
        isLoading={isLoading}
      />

      {/* 🧍‍♂️ Patient Details Modal */}
      <PatientDetailsModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        appointment={selectedAppointment}
        onStartConsultation={handleStartConsultation}
      />

      {/* 🗑️ Delete Appointment Modal */}
      <DeleteAppointmentModal
        isOpen={isDeleteModalOpen}
        appointmentId={appointmentIdToDelete}
        patientName={patientNameToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAppointmentIdToDelete(-1);
          setPatientNameToDelete("");
        }}
        onConfirmDelete={confirmDeleteAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
