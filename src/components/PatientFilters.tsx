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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: number | string;
  name: string;
}

interface PatientFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  status: string;
  setStatus: (status: string) => void;
  disease: string;
  setDisease: (disease: string) => void;
  sex: string;
  setSex: (sex: string) => void;
  slotTime: string;
  setSlotTime: (slot: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  applyFilters: () => void;
  clearFilters: () => void;

  // Dynamic dropdown options
  locationOptions: Option[];
  diseaseOptions: Option[];
  sexOptions: Option[];
  slotTimeOptions: Option[];
}

const PatientFilters: React.FC<PatientFiltersProps> = ({
  location,
  setLocation,
  status,
  setStatus,
  disease,
  setDisease,
  sex,
  setSex,
  slotTime,
  setSlotTime,
  date,
  setDate,
  applyFilters,
  clearFilters,
  locationOptions,
  diseaseOptions,
  sexOptions,
  slotTimeOptions,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mt-3 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* 🏥 Consultation Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Consultation Location
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((loc) => (
                <SelectItem key={loc.id} value={String(loc.id)}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🩺 Treatment Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Treatment Status
          </Label>
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

        {/* 🧬 Disease */}
        <div className="space-y-2">
          <Label htmlFor="disease" className="text-sm font-medium">
            Disease
          </Label>
          <Select value={disease} onValueChange={setDisease}>
            <SelectTrigger id="disease">
              <SelectValue placeholder="Select disease" />
            </SelectTrigger>
            <SelectContent>
              {diseaseOptions.map((dis) => (
                <SelectItem key={dis.id} value={String(dis.id)}>
                  {dis.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🚻 Sex */}
        <div className="space-y-2">
          <Label htmlFor="sex" className="text-sm font-medium">
            Sex
          </Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              {sexOptions.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ⏰ Time Slot */}
        <div className="space-y-2">
          <Label htmlFor="slotTime" className="text-sm font-medium">
            Time Slot
          </Label>
          <Select value={slotTime} onValueChange={setSlotTime}>
            <SelectTrigger id="slotTime">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {slotTimeOptions.map((slot) => (
                <SelectItem key={slot.id} value={String(slot.id)}>
                  {slot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🗓️ Recent Appointment Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Recent Appointment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-300",
                  !date && "text-muted-foreground"
                )}
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
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 🔘 Action Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
        >
          <FilterX className="h-4 w-4" />
          Clear
        </Button>

        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PatientFilters;
