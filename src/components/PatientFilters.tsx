import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  location: string;
  setLocation: (location: string) => void;
  status: string;
  setStatus: (status: string) => void;
  disease: string;
  setDisease: (type: string) => void;
  sex: string;
  setSex: (type: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const PatientFilters: React.FC<FiltersProps> = ({
  location,
  setLocation,
  status,
  setStatus,
  disease,
  setDisease,
  sex,
  setSex,
  date,
  setDate,
  applyFilters,
  clearFilters,
}) => {
  return (
    <div
      className="p-4 rounded-md shadow-sm border mb-4"
      style={{ background: "#f5f5f5" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Consultation Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="main-clinic">Main Clinic</SelectItem>
              <SelectItem value="north-branch">North Branch</SelectItem>
              <SelectItem value="south-branch">South Branch</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Treatment Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Disease</Label>
          <Select value={disease} onValueChange={setDisease}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Fever">Fever</SelectItem>
              <SelectItem value="Diarhoea">Diarhoea</SelectItem>
              <SelectItem value="Headache">Headache</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Sex</Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Recent Appointment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={applyFilters}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PatientFilters;
