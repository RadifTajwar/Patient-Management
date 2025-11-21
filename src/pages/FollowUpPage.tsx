import React, { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Mail, Calendar, Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock API - Replace with your actual API calls
const getFollowUpAppointments = async (filters: any) => {
  // Replace with actual API call
  return {
    data: [
      {
        id: 1,
        name: "John Doe",
        age: 45,
        sex: "Male",
        phone: "+1234567890",
        email: "john.doe@email.com",
        address: "123 Main St",
        patientId: 101,
        consultLocationName: "Cardiology Clinic",
        slotTime: "10:00 AM",
        consultType: "Follow Up",
        dateTime: "2025-01-15T10:00:00",
        appointmentStatus: "completed",
        paymentStatus: "paid",
        serialNo: "APT-001",
        followUpDate: new Date().toISOString().split("T")[0],
        lastVisitDate: "2024-12-15",
        diagnosis: "Hypertension",
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 32,
        sex: "Female",
        phone: "+1987654321",
        email: "jane.smith@email.com",
        address: "456 Oak Ave",
        patientId: 102,
        consultLocationName: "General Medicine",
        slotTime: "02:00 PM",
        consultType: "Follow Up",
        dateTime: "2025-01-10T14:00:00",
        appointmentStatus: "completed",
        paymentStatus: "paid",
        serialNo: "APT-002",
        followUpDate: new Date().toISOString().split("T")[0],
        lastVisitDate: "2024-12-20",
        diagnosis: "Diabetes Type 2",
      },
    ],
  };
};

const sendFollowUpEmail = async (patientId: number, emailData: any) => {
  // Replace with actual API call
  console.log("Sending email to patient:", patientId, emailData);
  return { status: 200 };
};

const createAppointment = async (appointmentData: any) => {
  // Replace with actual API call
  console.log("Creating appointment:", appointmentData);
  return { status: 200, data: { id: 123 } };
};

// Types
interface FollowUpPatient {
  id: number;
  name: string;
  age: number;
  sex: string;
  phone: string;
  email: string;
  address: string;
  patientId: number;
  consultLocationName?: string;
  slotTime?: string;
  consultType: string;
  dateTime: string;
  appointmentStatus: string;
  paymentStatus: string;
  serialNo: string | number;
  followUpDate: string;
  lastVisitDate: string;
  diagnosis?: string;
}

// Search Bar Component
const FollowUpSearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onMenuToggle: () => void;
}> = ({ searchQuery, setSearchQuery, onSearch, onMenuToggle }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border rounded-lg shadow-sm p-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full sm:w-auto flex-1"
      >
        <Input
          type="text"
          placeholder="Search by patient name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="bg-black  flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        onClick={onMenuToggle}
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
      </Button>
    </div>
  );
};

// Filters Component
const FollowUpFilters: React.FC<{
  location: string;
  setLocation: (val: string) => void;
  contactStatus: string;
  setContactStatus: (val: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  locationOptions: Array<{ id: string | number; name: string }>;
}> = ({
  location,
  setLocation,
  contactStatus,
  setContactStatus,
  applyFilters,
  clearFilters,
  locationOptions,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mt-3 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Consultation Location
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((loc) => (
                <SelectItem key={loc.id} value={String(loc.id)}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactStatus" className="text-sm font-medium">
            Contact Status
          </Label>
          <Select value={contactStatus} onValueChange={setContactStatus}>
            <SelectTrigger id="contactStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">All</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="not_contacted">Not Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-gray-300 hover:bg-gray-100"
        >
          Clear
        </Button>
        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

// Follow Up Item Component
const FollowUpItem: React.FC<{
  patient: FollowUpPatient;
  onSendEmail: (patient: FollowUpPatient) => void;
  onCreateAppointment: (patient: FollowUpPatient) => void;
}> = ({ patient, onSendEmail, onCreateAppointment }) => {
  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-3 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Patient Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{patient.name}</h3>
              <p className="text-sm text-gray-600">
                {patient.sex}, {patient.age} years
              </p>
            </div>
          </div>

          <div className="ml-12 space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">Phone:</span> {patient.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span> {patient.email}
            </p>
            <p>
              <span className="font-medium">Last Visit:</span>{" "}
              {formatDate(patient.lastVisitDate)}
            </p>
            {patient.diagnosis && (
              <p>
                <span className="font-medium">Diagnosis:</span>{" "}
                {patient.diagnosis}
              </p>
            )}
            {patient.consultLocationName && (
              <p>
                <span className="font-medium">Location:</span>{" "}
                {patient.consultLocationName}
              </p>
            )}
          </div>
        </div>

        {/* Follow Up Info */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            Follow-up Due: {formatDate(patient.followUpDate)}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {patient.consultType}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Button
            onClick={() => onSendEmail(patient)}
            className="bg-black w-full md:w-auto flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          <Button
            onClick={() => onCreateAppointment(patient)}
            className="bg-black w-full md:w-auto flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Create Appointment
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Email Modal Component
const EmailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  patient: FollowUpPatient | null;
  onSend: (emailData: { subject: string; message: string }) => void;
}> = ({ isOpen, onClose, patient, onSend }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (patient) {
      setSubject(`Follow-up Appointment Reminder - ${patient.name}`);
      setMessage(
        `Dear ${patient.name},\n\nThis is a friendly reminder about your follow-up appointment scheduled for today.\n\nPlease contact us to schedule your visit.\n\nBest regards,\nYour Healthcare Team`
      );
    }
  }, [patient]);

  const handleSend = () => {
    onSend({ subject, message });
    setSubject("");
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Follow-up Email</DialogTitle>
          <DialogDescription>
            Send a reminder email to {patient?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-to">To</Label>
            <Input id="email-to" value={patient?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-message">Message</Label>
            <Textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Appointment Modal Component
const AppointmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  patient: FollowUpPatient | null;
  onCreateAppointment: (appointmentData: any) => void;
}> = ({ isOpen, onClose, patient, onCreateAppointment }) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = () => {
    onCreateAppointment({
      patientId: patient?.patientId,
      date: appointmentDate,
      time: appointmentTime,
      notes,
    });
    setAppointmentDate("");
    setAppointmentTime("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Follow-up Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for {patient?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="appointment-date">Appointment Date</Label>
            <Input
              id="appointment-date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment-time">Appointment Time</Label>
            <Input
              id="appointment-time"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment-notes">Notes</Label>
            <Textarea
              id="appointment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any notes or special instructions..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Create Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Follow Up Page
const FollowUpPage: React.FC = () => {
  const [patients, setPatients] = useState<FollowUpPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [location, setLocation] = useState("None");
  const [contactStatus, setContactStatus] = useState("None");

  // Filter options
  const [locationOptions, setLocationOptions] = useState([
    { id: "None", name: "All Locations" },
  ]);

  // Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<FollowUpPatient | null>(null);

  const fetchFollowUps = async (filters?: any) => {
    setIsLoading(true);
    try {
      const effectiveFilters = filters ?? {
        location,
        contactStatus,
        search: searchQuery,
        followUpDate: new Date().toISOString().split("T")[0],
      };

      const response = await getFollowUpAppointments(effectiveFilters);
      const data = response.data || [];
      setPatients(data);

      // Extract location options
      const locMap = new Map<number, string>();
      data.forEach((patient: any) => {
        if (patient.consultLocationName) {
          locMap.set(patient.patientId, patient.consultLocationName);
        }
      });

      setLocationOptions([
        { id: "None", name: "All Locations" },
        ...Array.from(locMap.entries()).map(([id, name]) => ({ id, name })),
      ]);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string, loc: string, status: string) => {
        fetchFollowUps({
          location: loc,
          contactStatus: status,
          search: query,
          followUpDate: new Date().toISOString().split("T")[0],
        });
      }, 400),
    []
  );

  useEffect(() => {
    debouncedFetch(searchQuery, location, contactStatus);
    return () => debouncedFetch.cancel();
  }, [searchQuery, location, contactStatus, debouncedFetch]);

  const applyFilters = () => {
    debouncedFetch(searchQuery, location, contactStatus);
  };

  const clearFilters = () => {
    setLocation("None");
    setContactStatus("None");
    setSearchQuery("");
    debouncedFetch("", "None", "None");
  };

  const handleSendEmail = (patient: FollowUpPatient) => {
    setSelectedPatient(patient);
    setIsEmailModalOpen(true);
  };

  const handleCreateAppointment = (patient: FollowUpPatient) => {
    setSelectedPatient(patient);
    setIsAppointmentModalOpen(true);
  };

  const handleEmailSend = async (emailData: {
    subject: string;
    message: string;
  }) => {
    try {
      if (selectedPatient) {
        await sendFollowUpEmail(selectedPatient.patientId, emailData);
        alert("Email sent successfully!");
        setIsEmailModalOpen(false);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleAppointmentCreate = async (appointmentData: any) => {
    try {
      await createAppointment(appointmentData);
      alert("Appointment created successfully!");
      setIsAppointmentModalOpen(false);
      fetchFollowUps();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Follow-up Patients</h1>
        <p className="text-gray-600 mb-6">
          Patients with follow-up appointments scheduled for today
        </p>

        <div className="space-y-4">
          <FollowUpSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() =>
              debouncedFetch(searchQuery, location, contactStatus)
            }
            onMenuToggle={() => setShowFilters(!showFilters)}
          />

          {showFilters && (
            <FollowUpFilters
              location={location}
              setLocation={setLocation}
              contactStatus={contactStatus}
              setContactStatus={setContactStatus}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              locationOptions={locationOptions}
            />
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No follow-up patients for today</p>
          </div>
        ) : (
          patients.map((patient) => (
            <FollowUpItem
              key={patient.id}
              patient={patient}
              onSendEmail={handleSendEmail}
              onCreateAppointment={handleCreateAppointment}
            />
          ))
        )}
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        patient={selectedPatient}
        onSend={handleEmailSend}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        patient={selectedPatient}
        onCreateAppointment={handleAppointmentCreate}
      />
    </div>
  );
};

export default FollowUpPage;
