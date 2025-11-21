import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarClock,
  CreditCard,
  MessageSquare,
  FileText,
  BarChart2,
  X,
} from "lucide-react";
import { FaCalendarCheck, FaUserGroup } from "react-icons/fa6";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      label: "Analytics Data",
      icon: <BarChart2 className="mr-2 h-5 w-5" />,
      path: "/analytics",
    },
    {
      label: "Appointment List",
      icon: <FaCalendarCheck className="mr-2 h-5 w-5" />,
      path: "/appointments",
    },
    {
      label: "Patient List",
      icon: <FaUserGroup className="mr-2 h-5 w-5" />,
      path: "/patients",
    },

    {
      label: "Follow Up",
      icon: <MessageSquare className="mr-2 h-5 w-5" />,
      path: "/follow-up",
    },
    {
      label: "Finance",
      icon: <CreditCard className="mr-2 h-5 w-5" />,
      path: "/finance",
    },
    {
      label: "Consultant Scheduling",
      icon: <CalendarClock className="mr-2 h-5 w-5" />,
      path: "/consultants",
    },
    {
      label: "Research Data",
      icon: <FileText className="mr-2 h-5 w-5" />,
      path: "/research",
    },

    {
      label: "Account Settings",
      icon: <CreditCard className="mr-2 h-5 w-5" />,
      path: "/account",
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-white shadow-lg flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold" style={{ marginLeft: "20px" }}>
          Menu
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <X className="h-6 w-6" size={30} />
        </button>
      </div>

      <div className="flex-1 p-4">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
