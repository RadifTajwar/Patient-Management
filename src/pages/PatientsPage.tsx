import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";

// Components
import PatientSearchBar from "@/components/PatientSearchBar";
import PatientFilters from "@/components/PatientFilters";
import PatientList, { Patient } from "@/components/PatientList";

// API
import { getPatients } from "@/api/patient";

interface Option {
  id: number | string;
  name: string;
}

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [location, setLocation] = useState("None");
  const [status, setStatus] = useState("None");
  const [disease, setDisease] = useState("None");
  const [sex, setSex] = useState("None");
  const [slotTime, setSlotTime] = useState("None");
  const [date, setDate] = useState<Date>(new Date()); // ✅ Default to today

  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Filter dropdown options
  const [locationOptions, setLocationOptions] = useState<Option[]>([
    { id: "None", name: "None" },
  ]);
  const [diseaseOptions, setDiseaseOptions] = useState<Option[]>([
    { id: "None", name: "None" },
  ]);
  const [sexOptions, setSexOptions] = useState<Option[]>([
    { id: "None", name: "None" },
  ]);
  const [slotTimeOptions, setSlotTimeOptions] = useState<Option[]>([
    { id: "None", name: "None" },
  ]);

  // 🔹 Fetch Patients
  const fetchPatients = async (filters: any) => {
    try {
      const response = await getPatients(filters);
      const data = response.data || [];
      setPatients(data);

      // ✅ Dynamically populate dropdowns
      const locSet = new Set<string>();
      const diseaseSet = new Set<string>();
      const sexSet = new Set<string>();
      const slotSet = new Map<number | string, string>();

      data.forEach((p: any) => {
        if (p.consultLocationName && p.consultLocationName !== "N/A")
          locSet.add(p.consultLocationName);
        if (p.disease && p.disease !== "None") diseaseSet.add(p.disease);
        if (p.sex && p.sex !== "None") sexSet.add(p.sex);
        if (p.timeSlotId && p.startTime && p.endTime)
          slotSet.set(p.timeSlotId, `${p.startTime} - ${p.endTime}`);
      });

      setLocationOptions([
        { id: "None", name: "None" },
        ...Array.from(locSet).map((l) => ({ id: l, name: l })),
      ]);

      setDiseaseOptions([
        { id: "None", name: "None" },
        ...Array.from(diseaseSet).map((d) => ({ id: d, name: d })),
      ]);

      setSexOptions([
        { id: "None", name: "None" },
        ...Array.from(sexSet).map((s) => ({ id: s, name: s })),
      ]);

      setSlotTimeOptions([
        { id: "None", name: "None" },
        ...Array.from(slotSet.entries()).map(([id, name]) => ({ id, name })),
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch patient data",
        variant: "destructive",
      });
    }
  };

  // 🔹 Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        setIsLoading(true);
        fetchPatients({
          disease,
          sex,
          consultlocation: location,
          treatmentStatus: status,
          slotTime,
          recentAppointmentDate: new Date(date).toLocaleDateString("en-CA"), // ✅ always use selected date
          search: query,
        });
      }, 500),
    [disease, sex, location, status, slotTime, date]
  );

  // 🔹 Effects
  useEffect(() => {
    debouncedFetch(searchQuery);
    return () => debouncedFetch.cancel();
  }, [searchQuery, debouncedFetch]);

  // ✅ Initial fetch — with today’s date
  useEffect(() => {
    setIsLoading(true);
    fetchPatients({
      disease: "None",
      sex: "None",
      consultlocation: "None",
      treatmentStatus: "None",
      slotTime: "None",
      recentAppointmentDate: new Date().toLocaleDateString("en-CA"),
      search: "",
    });
  }, []);

  // 🔹 Filters
  const applyFilters = () => {
    setIsLoading(true);
    setSearchQuery("");
    fetchPatients({
      disease,
      sex,
      consultlocation: location,
      treatmentStatus: status,
      slotTime,
      recentAppointmentDate: new Date(date).toLocaleDateString("en-CA"),
      search: "",
    });
  };

  const clearFilters = () => {
    setLocation("None");
    setStatus("None");
    setDisease("None");
    setSex("None");
    setSlotTime("None");
    setDate(new Date()); // ✅ Reset to today’s date
    setSearchQuery("");
    setIsLoading(true);
    fetchPatients({
      disease: "None",
      sex: "None",
      consultlocation: "None",
      treatmentStatus: "None",
      slotTime: "None",
      recentAppointmentDate: new Date().toLocaleDateString("en-CA"),
      search: "",
    });
  };

  // 🔹 Navigation
  const handleViewDetails = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };
  const handleStartConsultation = (
    lastConsultationId: number,
    patientId: number
  ) => {
    navigate(`/consultation/${patientId}/${lastConsultationId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Patients</h1>

        <div className="space-y-4">
          {/* 🔍 Search */}
          <PatientSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() => debouncedFetch(searchQuery)}
            onMenuToggle={() => setShowFilters(!showFilters)}
          />

          {/* ⚙️ Filters */}
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
              slotTime={slotTime}
              setSlotTime={setSlotTime}
              date={date}
              setDate={setDate}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              locationOptions={locationOptions}
              diseaseOptions={diseaseOptions}
              sexOptions={sexOptions}
              slotTimeOptions={slotTimeOptions}
            />
          )}
        </div>
      </div>

      {/* 🩺 Patient List */}
      <PatientList
        patients={patients}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
        handleStartConsultation={handleStartConsultation}
      />
    </div>
  );
};

export default PatientsPage;
