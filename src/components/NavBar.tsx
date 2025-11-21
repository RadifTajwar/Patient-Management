import React, { useState } from "react";
import { Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserButton } from "./auth/user-button";
interface NavBarProps {
  onMenuToggle: () => void;
}

const getInitials = (name: string) => {
  return name
    ?.split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    ?.substring(0, 2);
};

const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div className="bg-white  p-4 flex items-center justify-between container">
      <div className="flex items-center ">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <h1 className="text-xl font-semibold">CarePad</h1>
      </div>

      {!isAuthPage && <UserButton />}
    </div>
  );
};

export default NavBar;
