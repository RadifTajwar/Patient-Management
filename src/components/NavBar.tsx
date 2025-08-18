import React, { useState } from "react";
import { Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavBarProps {
  onMenuToggle: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        {!isAuthPage && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">CarePad</h1>
      </div>

      {!isAuthPage && (
        <Link
          to="/profile"
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors"
        >
          <Avatar className="h-8 w-8">
            {/* <AvatarImage
              src={`https://source.unsplash.com/random/100x100/?portrait`}
              alt="Doctor"
            /> */}
            <AvatarFallback>{getInitials("Dr Kamran Akmal")}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Dr Kamran Akmal</span>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
