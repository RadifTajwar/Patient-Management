import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorRegistrationData } from "@/pages/RegisterPage";
import { Plus, Trash2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

interface PracticeInfoStepProps {
  formData: DoctorRegistrationData;
  updateFormData: (data: Partial<DoctorRegistrationData>) => void;
}

const PracticeInfoStep: React.FC<PracticeInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const addConsultationLocation = () => {
    const updatedLocations = [...formData.consultationLocations, ""];
    updateFormData({ consultationLocations: updatedLocations });
  };

  const updateConsultationLocation = (index: number, value: string) => {
    const updatedLocations = [...formData.consultationLocations];
    updatedLocations[index] = value;
    updateFormData({ consultationLocations: updatedLocations });
  };

  const removeConsultationLocation = (index: number) => {
    if (formData.consultationLocations.length > 1) {
      const updatedLocations = formData.consultationLocations.filter(
        (_, i) => i !== index
      );
      updateFormData({ consultationLocations: updatedLocations });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Consultation Locations</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addConsultationLocation}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Location
          </Button>
        </div>

        {formData.consultationLocations.map((location, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={location}
              onChange={(e) =>
                updateConsultationLocation(index, e.target.value)
              }
              placeholder="e.g. Chamber at City Hospital, Room #203"
              className="flex-1"
            />
            {formData.consultationLocations.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeConsultationLocation(index)}
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeInfoStep;
