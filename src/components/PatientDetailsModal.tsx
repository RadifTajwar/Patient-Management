import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment } from "./AppointmentList";
import { appendFile } from "node:fs";

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onStartConsultation: (id: number) => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onStartConsultation,
}) => {
  if (!appointment) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={appointment.imageURL} alt={appointment.name} />
              <AvatarFallback className="text-lg">
                {getInitials(appointment.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{appointment.name}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 mt-1">
                <span>{appointment.sex}</span>
                <span>•</span>
                <span>{appointment.age} years</span>
                <span>•</span>
                <span>{appointment.consultlocation}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{appointment.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{appointment.email || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{appointment.address || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p>{appointment.consultType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>{appointment.appointmentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p>{processISOString(appointment.dateTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {appointment.patientCondition && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Medical History</h3>
                <ul className="list-disc pl-5">
                  <li>{appointment.patientCondition}</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => onStartConsultation(appointment.id)}
            className="bg-black hover:bg-blue-700"
          >
            Start Consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsModal;
