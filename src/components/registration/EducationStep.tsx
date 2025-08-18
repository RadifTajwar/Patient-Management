import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorRegistrationData, Degree } from "@/pages/RegisterPage";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface EducationStepProps {
  formData: DoctorRegistrationData;
  updateFormData: (data: Partial<DoctorRegistrationData>) => void;
}

const EducationStep: React.FC<EducationStepProps> = ({
  formData,
  updateFormData,
}) => {
  const addDegree = () => {
    const updatedDegrees = [
      ...formData.degrees,
      { degree: "", institution: "", year: "" },
    ];
    updateFormData({ degrees: updatedDegrees });
  };

  const updateDegree = (index: number, field: keyof Degree, value: string) => {
    const updatedDegrees = [...formData.degrees];
    updatedDegrees[index] = {
      ...updatedDegrees[index],
      [field]: value,
    };
    updateFormData({ degrees: updatedDegrees });
  };

  const removeDegree = (index: number) => {
    if (formData.degrees.length > 1) {
      const updatedDegrees = formData.degrees.filter((_, i) => i !== index);
      updateFormData({ degrees: updatedDegrees });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Degree & Qualifications</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDegree}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Degree
        </Button>
      </div>

      {formData.degrees.map((degree, index) => (
        <div key={index} className="space-y-4 border rounded-md p-4 relative">
          <div className="absolute top-3 right-3">
            {formData.degrees.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDegree(index)}
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
              <Input
                id={`degree-${index}`}
                value={degree.degree}
                onChange={(e) => updateDegree(index, "degree", e.target.value)}
                placeholder="e.g. MBBS, MD, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`institution-${index}`}>Institution</Label>
              <Input
                id={`institution-${index}`}
                value={degree.institution}
                onChange={(e) =>
                  updateDegree(index, "institution", e.target.value)
                }
                placeholder="e.g. Dhaka Medical College"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`year-${index}`}>Year</Label>
              <Input
                id={`year-${index}`}
                value={degree.year}
                onChange={(e) => updateDegree(index, "year", e.target.value)}
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
