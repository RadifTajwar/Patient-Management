import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatientItemProps {
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
  appointmentStatus?: string;
  recentAppointmentDate: string;
  disease: string;
  lastConsultationId: number;
  handleStartConsultation: (id: number, patientId: number) => void;
  onViewDetails: (id: number) => void;
}

const PatientItem: React.FC<PatientItemProps> = ({
  id,
  name,
  imageURL,
  age,
  sex,
  address,
  height,
  weight,
  phone,
  email,
  bloodGroup,
  dob,
  consultlocation,
  treatmentStatus,
  appointmentStatus,
  recentAppointmentDate,
  disease,
  onViewDetails,
  lastConsultationId,
  handleStartConsultation,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "paused":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      ?.substring(0, 2);
  };

  const processISOString = (date: string) => {
    const year = date?.substring(0, 4);
    const month = date?.substring(5, 7);
    const day = date?.substring(8, 10);
    const time = date?.substring(11, 16);

    let monthName = "";
    switch (month) {
      case "01":
        monthName = "January";
        break;
      case "02":
        monthName = "February";
        break;
      case "03":
        monthName = "March";
        break;
      case "04":
        monthName = "April";
        break;
      case "05":
        monthName = "May";
        break;
      case "06":
        monthName = "June";
        break;
      case "07":
        monthName = "July";
        break;
      case "08":
        monthName = "August";
        break;
      case "09":
        monthName = "September";
        break;
      case "10":
        monthName = "October";
        break;
      case "11":
        monthName = "November";
        break;
      case "12":
        monthName = "December";
        break;
    }

    const dateFormat = day + " " + monthName + ", " + year + "  " + time;

    return dateFormat;
  };

  return (
    <Card className="mb-3 p-4 hover:shadow-md transition-shadow duration-200">
      {/* 1 col on mobile; explicit 4 cols on lg: [info | phone | date | actions] */}
      <div
        className="grid gap-4 items-center
                  grid-cols-1
                  lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        {/* Patient Info */}
        <div className="flex items-start gap-3 min-w-0">
          <Avatar>
            <AvatarImage src={imageURL} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-medium text-lg truncate">{name}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span>{sex}</span>
              <span>•</span>
              <span>{age} years</span>
              <span>•</span>
              <span className="truncate">{consultlocation}</span>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="lg:justify-center flex">
          <Badge
            className={`whitespace-nowrap ${getStatusColor(treatmentStatus)}`}
          >
            {phone}
          </Badge>
        </div>

        {/* Date */}
        <div className="lg:justify-center flex">
          <span className="text-sm bg-gray-100 text-gray-800 py-1 px-3 rounded-full whitespace-nowrap">
            {processISOString(recentAppointmentDate)}
          </span>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-2 shrink-0">
          {appointmentStatus?.toLowerCase() === "completed" ? (
            <Button
              disabled
              className="bg-gray-300 text-gray-600 cursor-not-allowed rounded-xl px-4 py-2 whitespace-nowrap"
            >
              Consultation Completed
            </Button>
          ) : (
            <Button
              onClick={() => handleStartConsultation(lastConsultationId, id)}
              className="bg-black hover:bg-blue-700 rounded-xl px-4 py-2 whitespace-nowrap"
            >
              Start Consultation
            </Button>
          )}

          <Button
            onClick={() => onViewDetails(id)}
            className="bg-black hover:bg-blue-700 rounded-xl px-4 py-2 whitespace-nowrap"
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PatientItem;
