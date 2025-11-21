import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GoTrash } from "react-icons/go";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

interface AppointmentItemProps {
  id: number;
  name: string;
  age: number;
  sex: string;
  phone: string;
  email: string;
  address: string;
  imageURL?: string;
  patientId?: number;
  consultLocationName?: string;
  slotTime?: string;
  consultType: string;
  date: string;
  appointmentStatus: string;
  patientCondition?: string;
  paymentStatus: string;
  serialNo?: string | number;
  handleUpdateAppointment: (
    id: number,
    updatedData: Partial<AppointmentItemProps>
  ) => void;
  onConfirmAppointment: (id: number) => void;
  onDeleteAppointment: (id: number) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({
  id,
  name,
  age,
  sex,
  phone,
  email,
  address,
  consultLocationName,
  slotTime,
  consultType,
  date,
  appointmentStatus,
  patientCondition,
  paymentStatus,
  serialNo,
  handleUpdateAppointment,
  onConfirmAppointment,
  onDeleteAppointment,
}) => {
  const onStartAppointment = (id: number) => {
    if (appointmentStatus.toLowerCase() === "booked") {
      handleUpdateAppointment(id, { appointmentStatus: "scheduled" });
    } else {
      onConfirmAppointment(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "waiting_approval":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "new patient":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "follow up":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "special checkup":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const processISOString = (date: string) => {
    const year = date?.substring(0, 4);
    const month = date?.substring(5, 7);
    const day = date?.substring(8, 10);
    const time = date?.substring(11, 16);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${day} ${monthName}, ${year} ${time}`;
  };

  return (
    <Card className="mb-3 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center grid lg:grid-cols-6 gap-4">
        {/* 🧩 Patient Info */}
        <div className="space-y-1 col-span-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <p className="text-sm font-bold">Serial No: {serialNo}</p>
            </div>
          </div>

          {/* 🩺 Details (Sex, Age, Location, Slot Time) */}
          <div
            className="flex flex-col text-sm text-gray-700"
            style={{ marginLeft: "50px" }}
          >
            <span>
              {sex}, {age} years
            </span>
            <span className="font-medium text-gray-900">
              Location:{" "}
              <span className="font-normal">
                {consultLocationName ?? "N/A"}
              </span>
            </span>
            <span className="font-medium text-gray-900">
              Slot Time:{" "}
              <span className="font-normal">{slotTime ?? "N/A"}</span>
            </span>
          </div>
        </div>

        {/* 🧩 Status badges */}
        <div className="flex flex-wrap gap-2 mt-2 col-span-2">
          <Badge className={getTypeColor(consultType)}>{consultType}</Badge>
          <Badge className={getStatusColor(appointmentStatus)}>
            {appointmentStatus}
          </Badge>
          <Badge className={getPaymentStatusColor(paymentStatus)}>
            {paymentStatus}
          </Badge>
        </div>

        {/* 🧩 Appointment date */}
        <div className="flex flex-wrap gap-2 mt-2 col-span-1">
          <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
            {processISOString(date)}
          </span>
        </div>

        {/* 🧩 Action Buttons */}
        <div className="mt-3 md:mt-0 w-full md:w-auto grid grid-cols-2 gap-2 col-span-1">
          <Button
            onClick={() => onStartAppointment(id)}
            disabled={appointmentStatus === "confirmed"}
            className={`w-full sm:w-auto col-span-1 hidden sm:flex ${
              appointmentStatus === "confirmed"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-blue-700"
            }`}
          >
            {appointmentStatus === "booked"
              ? "Schedule"
              : appointmentStatus === "scheduled"
              ? "Confirm"
              : "Confirmed"}
          </Button>

          <Button
            onClick={() => onDeleteAppointment(id)}
            className="bg-red-500 hover:bg-red-700 w-full sm:w-auto col-span-1 hidden sm:flex"
          >
            Delete
          </Button>

          {/* Mobile Buttons */}
          <div className="sm:hidden flex items-center justify-center">
            <button
              onClick={() => onStartAppointment(id)}
              disabled={paymentStatus !== "pending"}
              className={`p-2 rounded-full ${
                paymentStatus === "pending"
                  ? "hover:bg-blue-700 bg-black"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {paymentStatus === "pending" ? (
                <FaRegSquare className="text-white" />
              ) : (
                <FaRegCheckSquare className="text-white opacity-50" />
              )}
            </button>
          </div>

          <div className="sm:hidden flex items-center justify-center">
            <button
              onClick={() => onDeleteAppointment(id)}
              className="p-2 bg-red-500 hover:bg-red-700 rounded"
            >
              <GoTrash className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentItem;
