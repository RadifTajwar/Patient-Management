"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Loader, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getRefreshToken, getBMDC } from "@/utils/accessutils";
import { jwtDecode } from "jwt-decode";

export const UserButton = () => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState<{ name?: string; email?: string } | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded">("loading");

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const accessToken = getAccessToken();

    
    try {
      const decoded: any = jwtDecode(accessToken);
      const nameFromToken = decoded?.name || decoded?.username || decoded?.email?.split("@")[0];
      const emailFromToken = decoded?.email || decoded?.username;

      setLocalUser({
        name: nameFromToken,
        email: emailFromToken,
      });
    } catch (e) {
      console.error("Failed to decode access token:", e);
      handleLogout();
    } finally {
      setStatus("loaded");
    }
  }, []);

  const handleLogout = () => {

    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("bmdc");
    navigate(`/login`);
  };

  if (status === "loading") {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { name, email } = localUser || {};
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email
    ? email.charAt(0).toUpperCase()
    : "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={10} className="w-60">
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">{name || "User"}</p>
            <p className="text-xs text-neutral-500">{email || "No email provided"}</p>
          </div>
        </div>
        <Separator className="mb-1" />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
