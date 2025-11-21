import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onMenuToggle: () => void;
}

const PatientSearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onMenuToggle,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center grid md:grid-cols-1 lg:grid-cols-6 gap-6">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full col-span-5">
        <Input
          type="text"
          placeholder="Search patients..."
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
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Search className="h-5 w-5" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default PatientSearchBar;
