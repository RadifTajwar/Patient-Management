import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppointmentItemProps {
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
  onStartAppointment: (id: number) => void;
  onDeleteAppointment: (id: number) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({
  name,
  age,
  sex,
  phone,
  email,
  height,
  weight,
  bloodGroup,
  dob,
  address,
  imageURL,
  id,
  patientId,
  consultlocation,
  consultType,
  dateTime,
  appointmentStatus,
  patientCondition,
  onStartAppointment,
  onDeleteAppointment,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const processISOString = (date: string) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const time = date.substring(11, 16);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center grid lg:grid-cols-6 gap-4">
        <div className="space-y-1 col-span-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              {/* <AvatarImage
                src={`https://source.unsplash.com/random/100x100/?portrait`}
              /> */}
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">{name}</h3>
          </div>

          <div
            className="flex flex-wrap gap-2 text-sm text-gray-500"
            style={{ marginLeft: "50px" }}
          >
            <span>{sex}</span>
            <span>•</span>
            <span>{age} years</span>
            <span>•</span>
            <span>{consultlocation}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 col-span-2">
          <Badge className={getTypeColor(consultType)}>{consultType}</Badge>
          <Badge className={getStatusColor(appointmentStatus)}>
            {appointmentStatus}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 col-span-1">
          <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
            {processISOString(dateTime)}
          </span>
        </div>

        <div className="mt-3 md:mt-0 w-full md:w-auto grid grid-cols-2 gap-4">
          <Button
            onClick={() => onStartAppointment(id)}
            className="bg-black hover:bg-blue-700 w-full md:w-auto col-span-1"
          >
            Start
          </Button>

          <Button
            onClick={() => onDeleteAppointment(id)}
            className="bg-red-500 hover:bg-red-700"
            style={{ float: "right" }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentItem;
