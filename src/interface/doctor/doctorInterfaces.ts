// Each time slot in a day
export interface TimeSlot {
  slotActive: boolean;   // whether this slot is currently active
  startTime: string;     // e.g. "09:00"
  endTime: string;       // e.g. "12:00"
  slotDuration: number;  // in minutes
  capacity: number;      // auto-calculated
}

// Active day with its slots
export interface ActiveDay {
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  isActive: boolean;
  timeSlots: TimeSlot[];
}

// Consultation Location
export interface ConsultationLocation {
  id: string;  // unique ID for this location
  locationName: string;
  address: string;
  locationType: "Hospital" | "Clinic" | "Chamber"; // type of practice location
  roomNumber?: string;    // optional (not all locations have rooms)
  consultationFee: number;
  activeDays: ActiveDay[];
  isPublished?: boolean; // whether this location is published
}

// Education info
export interface Degree {
  degreeName: string;
  institution: string;
  year: number;
}

// Doctor Registration
export interface DoctorRegistrationData {
  name: string;
  bmdcNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  promoCode: string;
}