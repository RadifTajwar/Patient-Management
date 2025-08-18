import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 32, className }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="animate-spin" size={size} color="#3B82F6" />
    </div>
  );
};

export default Spinner;
