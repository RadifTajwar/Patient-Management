import { ConsultationLocation } from "@/interface/doctor/doctorInterfaces";

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DEFAULT_LOCATION: ConsultationLocation = {
  locationName: "",
  address: "",
  locationType: "Hospital",
  roomNumber: "",
  consultationFee: 0,
  activeDays: weekDays.map((day) => ({
    day,
    isActive: false,
    timeSlots: [],
  })),
};
