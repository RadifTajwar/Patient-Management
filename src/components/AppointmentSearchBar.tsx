import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onMenuToggle: () => void;
}

const AppointmentSearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onMenuToggle,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border rounded-lg shadow-sm p-3">
      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full sm:w-auto flex-1"
      >
        <Input
          type="text"
          placeholder="Search by patient name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>

      {/* 🧭 Filter Toggle Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onMenuToggle}
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
      </Button>
    </div>
  );
};

export default AppointmentSearchBar;
