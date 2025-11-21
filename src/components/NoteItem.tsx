import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NoteItemProps {
  id: number;
  consultlocation: string;
  consultType: string;
  dateTime: string;
  disease: string;
  doctorNotes: string;
  onViewDetails: (id: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  id,
  consultlocation,
  consultType,
  dateTime,
  disease,
  doctorNotes,
  onViewDetails,
}) => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center grid lg:grid-cols-6 gap-4">
        <div className="space-y-1 col-span-2" style={{ marginLeft: "30px" }}>
          <div className="flex items-center space-x-3">
            <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
              {processISOString(dateTime)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 col-span-1">
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {disease}
          </Badge>
        </div>
        <div
          className="flex flex-wrap gap-2 mt-2 col-span-2"
          style={{ marginLeft: "100px" }}
        >
          <Badge className={getTypeColor(consultType)}>{consultType}</Badge>
        </div>

        <div
          className="mt-3 md:mt-0 w-full md:w-auto"
          style={{ marginRight: "30px" }}
        >
          <Button
            onClick={() => onViewDetails(id)}
            className="bg-black hover:bg-blue-700 w-full md:w-auto rounded-xl px-4 py-2"
            style={{ float: "right" }}
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NoteItem;
