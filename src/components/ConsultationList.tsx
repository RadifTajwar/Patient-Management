import React from "react";
import Spinner from "./Spinner";
import ConsultationItem from "./ConsultationItem";
import { ConsultationLocation } from "@/interface/doctor/doctorInterfaces";

interface ConsultationListProps {
  consultations: ConsultationLocation[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({
  consultations,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={50} />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No Consultations Found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-6 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b">
        <div className="col-span-1 ">Location</div>
        <div className="col-span-1">Publish Status</div>
        <div className="col-span-1">Address</div>
        <div className="col-span-1">Fee</div>
        <div className="col-span-1">Days</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      <div>
        {consultations.map((consultation) => (
          <ConsultationItem
            key={consultation.id}
            {...consultation}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsultationList;
