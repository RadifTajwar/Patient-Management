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
interface ConsultationFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  activeDay: string;
  setActiveDay: (day: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;

  // ✅ New dynamic options
  locationOptions: string[];
  dayOptions: string[];
  startTimeOptions: string[];
  endTimeOptions: string[];
}

const ConsultationFilters: React.FC<ConsultationFiltersProps> = ({
  location,
  setLocation,
  activeDay,
  setActiveDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  applyFilters,
  clearFilters,
  locationOptions,
  dayOptions,
  startTimeOptions,
  endTimeOptions,
}) => {
  return (
    <div className="p-4 rounded-md shadow-sm border mb-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consultation Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Consultation Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((loc, i) => (
                <SelectItem key={i} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Day */}
        <div className="space-y-2">
          <Label htmlFor="activeDay">Active Day</Label>
          <Select value={activeDay} onValueChange={setActiveDay}>
            <SelectTrigger id="activeDay">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((day, i) => (
                <SelectItem key={i} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {startTimeOptions.map((t, i) => (
                <SelectItem key={i} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {endTimeOptions.map((t, i) => (
                <SelectItem key={i} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
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
export default ConsultationFilters;
