import React from "react";
import AppointmentItem from "./AppointmentItem";
import { useToast } from "@/hooks/use-toast";
import Spinner from "./Spinner";

export interface Appointment {
  name: string;
  age: number;
  sex: string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  bloodGroup: string;
  dob: string;
  address: string;
  imageURL: string;
  id: number;
  patientId: number;
  consultlocation: string;
  consultType: string;
  dateTime: string;
  appointmentStatus: string;
  patientCondition: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStartAppointment: (id: number) => void;
  onDeleteAppointment: (id: number) => void;
  isLoading: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onStartAppointment,
  onDeleteAppointment,
  isLoading = false,
}) => {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {appointments.length === 0 ? (
        isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size={50} />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No Appointments Found</p>
          </div>
        )
      ) : (
        appointments.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            {...appointment}
            onStartAppointment={onStartAppointment}
            onDeleteAppointment={onDeleteAppointment}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentList;
