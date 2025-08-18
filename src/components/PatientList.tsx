import React from "react";
import { useToast } from "@/hooks/use-toast";
import PatientItem from "./PatientItem";
import Spinner from "./Spinner";

export interface Patient {
  id: number;
  name: string;
  imageURL: string;
  age: number;
  sex: string;
  address: string;
  height: number;
  weight: number;
  phone: string;
  email: string;
  bloodGroup: string;
  dob: Date;
  consultlocation: string;
  treatmentStatus: string;
  recentAppointmentDate: Date;
  disease: string;
}

interface PatientListProps {
  patients: Patient[];
  onViewDetails: (id: number) => void;
  isLoading: boolean;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onViewDetails,
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
      {patients.length === 0 ? (
        isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size={50} />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No Patients Found</p>
          </div>
        )
      ) : (
        patients.map((patient) => (
          <PatientItem
            key={patient.id}
            {...patient}
            onViewDetails={onViewDetails}
          />
        ))
      )}
    </div>
  );
};

export default PatientList;
