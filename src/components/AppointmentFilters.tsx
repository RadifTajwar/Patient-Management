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

// ✅ Define proper type for location options
interface LocationOption {
  id: number | string;
  name: string;
}

interface SlotTimeOption {
  id: number | string;
  name: string;
}
interface TypeOption {
  id: number | string;
  name: string;
}

interface AppointmentFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  status: string;
  setStatus: (status: string) => void;
  type: string;
  setType: (type: string) => void;
  slotTime: string;
  setSlotTime: (time: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  applyFilters: () => void;
  clearFilters: () => void;

  // Dynamic dropdowns
  locationOptions: LocationOption[];
  slotTimeOptions: SlotTimeOption[];
  typeOptions: TypeOption[];
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  location,
  setLocation,
  status,
  setStatus,
  type,
  setType,
  slotTime,
  setSlotTime,
  date,
  setDate,
  applyFilters,
  clearFilters,
  locationOptions,
  slotTimeOptions,
  typeOptions,
}) => {
  console.log("time slot options ", slotTimeOptions);
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mt-3 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* 📅 Appointment Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Appointment Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="waiting_approval">Waiting Approval</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 🧑‍⚕️ Consultation Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Consultation Type
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ⏰ Slot Time */}
        <div className="space-y-2">
          <Label htmlFor="slotTime" className="text-sm font-medium">
            Slot Time
          </Label>
          <Select value={slotTime} onValueChange={setSlotTime}>
            <SelectTrigger id="slotTime">
              <SelectValue placeholder="Select slot time" />
            </SelectTrigger>
            <SelectContent>
              {slotTimeOptions.map((time) => (
                <SelectItem key={time.id} value={String(time.id)}>
                  {time.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🗓️ Appointment Date */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label className="text-sm font-medium">Appointment Date</Label>
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
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
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

export default AppointmentFilters;
