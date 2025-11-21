import { z } from "zod";

// Time Slot
const timeSlotSchema = z
  .object({
    slotActive: z.boolean(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    slotDuration: z.number().min(5, "Duration must be at least 5 minutes"),
    capacity: z.number().min(0),
  })
  .superRefine((slot, ctx) => {
    // Ensure both start & end exist before comparing
    if (slot.startTime && slot.endTime) {
      const [sh, sm] = slot.startTime?.split(":").map(Number);
      const [eh, em] = slot.endTime?.split(":").map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be later than start time",
          path: ["endTime"],
        });
      }
    }
  });

// Active Day
const activeDaySchema = z.object({
  day: z.enum([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]),
  isActive: z.boolean(),
  timeSlots: z.array(timeSlotSchema),
});

// Consultation Location
export const consultationLocationSchema = z
  .object({
    locationName: z.string().min(1, "Location name is required"),
    address: z.string().min(1, "Address is required"),
    locationType: z.enum(["Hospital", "Clinic", "Chamber"], {
      required_error: "Location type is required",
    }),
    roomNumber: z.string().optional(),
    consultationFee: z.number().min(1, "Consultation fee is required"),
    activeDays: z.array(activeDaySchema),
  })
  .superRefine((data, ctx) => {
    // 1. At least one active day
    if (!data.activeDays.some((d) => d.isActive)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one active day must be selected",
        path: ["activeDays"],
      });
    }

    // 2. Each active day must have at least one slot
    data.activeDays.forEach((d, i) => {
      if (d.isActive && d.timeSlots.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Day "${d.day}" must have at least one time slot`,
          path: ["activeDays", i, "timeSlots"],
        });
      }
    });
  });

// Final Form Schema
export const consultationFormSchema = z.object({
  consultationLocation: consultationLocationSchema,
});

export type ConsultationFormData = z.infer<typeof consultationFormSchema>;
