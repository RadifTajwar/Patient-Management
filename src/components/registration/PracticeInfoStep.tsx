import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import {
  ConsultationLocation,
  TimeSlot,
} from "@/interface/doctor/doctorInterfaces";

// Weekdays
export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DEFAULT_LOCATION: ConsultationLocation = {
  locationName: "",
  address: "",
  locationType: "Hospital",
  roomNumber: "",
  consultationFee: 0,
  activeDays: weekDays.map((day) => ({
    day,
    isActive: false,
    timeSlots: [],
  })),
};

interface PracticeInfoStepProps {
  onCancel: () => void;
  onSubmit: () => void;
  buttonLabel: string;
}

const PracticeInfoStep: React.FC<PracticeInfoStepProps> = ({
  onCancel,
  onSubmit,
  buttonLabel,
}) => {
  const { control, watch, setValue } = useFormContext();

  const location = watch("consultationLocation");

  useEffect(() => {
    if (!location) {
      setValue("consultationLocation", DEFAULT_LOCATION, {
        shouldDirty: false,
      });
    }
  }, [location, setValue]);

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      slotActive: true,
      startTime: "",
      endTime: "",
      slotDuration: 15,
      capacity: 0,
    };

    const updated = [...location.activeDays];
    updated[dayIndex].timeSlots.push(newSlot);

    setValue("consultationLocation.activeDays", updated, {
      shouldDirty: true,
    });
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof Omit<TimeSlot, "capacity">,
    value: string | number
  ) => {
    const updated = [...location.activeDays];
    const slot = updated[dayIndex].timeSlots[slotIndex];

    slot[field] = value as any;

    if (slot.startTime && slot.endTime && slot.slotDuration) {
      const [sh, sm] = slot.startTime.split(":").map(Number);
      const [eh, em] = slot.endTime.split(":").map(Number);

      const total = eh * 60 + em - (sh * 60 + sm);
      slot.capacity = Math.max(0, Math.floor(total / slot.slotDuration));
    } else {
      slot.capacity = 0;
    }

    setValue("consultationLocation.activeDays", updated, {
      shouldDirty: true,
    });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...location.activeDays];
    updated[dayIndex].timeSlots = updated[dayIndex].timeSlots.filter(
      (_, i) => i !== slotIndex
    );

    setValue("consultationLocation.activeDays", updated, {
      shouldDirty: true,
    });
  };

  const loc = location || DEFAULT_LOCATION;

  return (
    <div className="space-y-4">
      {/* ============================ */}
      {/* Location Info */}
      {/* ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Name - NO ERROR MESSAGE */}
        <div>
          <FormLabel>Location Name</FormLabel>
          <Controller
            name="consultationLocation.locationName"
            control={control}
            render={({ field }) => (
              <Input placeholder="e.g. Apollo Hospital" {...field} />
            )}
          />
        </div>

        {/* Address - NO ERROR MESSAGE */}
        <div>
          <FormLabel>Address</FormLabel>
          <Controller
            name="consultationLocation.address"
            control={control}
            render={({ field }) => (
              <Input placeholder="e.g. Bashundhara, Dhaka" {...field} />
            )}
          />
        </div>

        {/* Location Type */}
        <div>
          <FormLabel>Location Type</FormLabel>
          <Controller
            name="consultationLocation.locationType"
            control={control}
            render={({ field }) => (
              <select {...field} className="border rounded px-2 py-1 w-full">
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Chamber">Chamber</option>
              </select>
            )}
          />
        </div>

        {/* Room Number */}
        <div>
          <FormLabel>Room Number (Optional)</FormLabel>
          <Controller
            name="consultationLocation.roomNumber"
            control={control}
            render={({ field }) => <Input placeholder="Room #101" {...field} />}
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <FormLabel>Consultation Fee</FormLabel>
          <Controller
            name="consultationLocation.consultationFee"
            control={control}
            render={({ field }) => (
              <Input type="number" placeholder="1200" {...field} />
            )}
          />
        </div>
      </div>

      {/* ============================ */}
      {/* Active Days + Time Slots */}
      {/* ============================ */}
      <div>
        <FormLabel>Active Days & Time Slots</FormLabel>

        <div className="space-y-4 mt-3">
          {loc.activeDays.map((dayObj, dayIndex) => (
            <div key={dayObj.day}>
              {/* Day checkbox */}
              <Controller
                name={`consultationLocation.activeDays.${dayIndex}.isActive`}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);

                        const updated = [...loc.activeDays];
                        updated[dayIndex].isActive = e.target.checked;
                        setValue("consultationLocation.activeDays", updated, {
                          shouldDirty: true,
                        });
                      }}
                    />
                    <span className="font-medium">
                      {dayObj.day.slice(0, 3)}.
                    </span>
                  </label>
                )}
              />

              {/* Time slot input area */}
              {dayObj.isActive && (
                <div className="mt-2 border rounded p-3 space-y-2">
                  {dayObj.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      {/* Start Time */}
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(
                            dayIndex,
                            slotIndex,
                            "startTime",
                            e.target.value
                          )
                        }
                      />

                      {/* End Time */}
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(
                            dayIndex,
                            slotIndex,
                            "endTime",
                            e.target.value
                          )
                        }
                      />

                      {/* Slot Duration */}
                      <Input
                        type="number"
                        value={slot.slotDuration}
                        onChange={(e) =>
                          updateTimeSlot(
                            dayIndex,
                            slotIndex,
                            "slotDuration",
                            Number(e.target.value)
                          )
                        }
                      />

                      {/* Capacity */}
                      <Input type="number" value={slot.capacity} readOnly />

                      {/* Remove Slot */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Slot */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    <Plus className="h-4 w-4" /> Add Time Slot
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================ */}
      {/* Save + Cancel */}
      {/* ============================ */}
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" onClick={onSubmit}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default PracticeInfoStep;
