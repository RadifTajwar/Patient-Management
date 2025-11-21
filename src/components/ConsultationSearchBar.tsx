import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search, Plus } from "lucide-react";

interface ConsultationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
  onAddNewLocation: () => void;
}

const ConsultationSearchBar: React.FC<ConsultationSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onMenuToggle,
  onAddNewLocation,
}) => {
  return (
    <div className="flex justify-between items-center grid md:grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="flex gap-2 w-full col-span-5">
        <Input
          type="text"
          placeholder="Search consultation locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onMenuToggle}
          className="px-3"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <Button
        onClick={onAddNewLocation}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Location
      </Button>
    </div>
  );
};

export default ConsultationSearchBar;
