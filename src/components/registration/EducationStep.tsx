import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { DoctorRegistrationData } from "@/interface/doctor/doctorInterfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const EducationStep: React.FC = () => {
  const { control, register } = useFormContext<DoctorRegistrationData>();

  // Manage dynamic degrees using useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "degrees",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Degree & Qualifications</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              degreeName: "",
              institution: "",
              year: new Date()?.getFullYear(),
            })
          }
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Degree
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 border rounded-md p-4 relative"
        >
          <div className="absolute top-3 right-3">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Degree/Certificate</Label>
              <Input
                {...register(`degrees.${index}.degreeName` as const)}
                placeholder="e.g. MBBS, MD, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                {...register(`degrees.${index}.institution` as const)}
                placeholder="e.g. Dhaka Medical College"
              />
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                {...register(`degrees.${index}.year` as const)}
                placeholder="e.g. 2018"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationStep;
