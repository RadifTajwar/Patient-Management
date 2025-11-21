import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SubmitButton() {
  return (
    <div className="flex justify-center">
      <Button type="submit" size="lg" className="w-full md:w-auto">
        <Check className="mr-2 h-4 w-4" /> Complete Consultation
      </Button>
    </div>
  );
}
