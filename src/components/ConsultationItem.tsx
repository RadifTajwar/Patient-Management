import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationLocation } from "@/interface/doctor/doctorInterfaces";
import { togglePublishLocation } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

export interface ConsultationItemProps extends ConsultationLocation {
  onUpdate?: (id: number, isPublished: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ConsultationItem: React.FC<ConsultationItemProps> = ({
  id,
  locationName,
  address,
  locationType,
  roomNumber,
  consultationFee,
  isPublished: published,
  activeDays,
  onUpdate,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(published);
  const { toast } = useToast();

  const toggleExpand = () => setExpanded((prev) => !prev);

  /** 🔥 Handle Publish / Unpublish */
  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      // ✅ enforce at least 500ms delay
      await new Promise((res) => setTimeout(res, 500));

      await togglePublishLocation({ locationId: id, publish: !isPublished });
      setIsPublished(!isPublished);

      // ✅ show toast
      toast({
        title: `Location ${!isPublished ? "Published" : "Unpublished"}`,
        description: `${locationName} has been ${
          !isPublished ? "published" : "unpublished"
        } successfully.`,
      });

      if (onUpdate) onUpdate(Number(id), !isPublished);
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast({
        title: "Error",
        description: "Failed to update publish status.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="border-b last:border-0">
      {/* Top Row */}
      <div className="grid grid-cols-6 items-center px-4 py-2 text-sm hover:bg-gray-50 transition">
        {/* Location */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpand}
            className="flex items-center text-gray-600 hover:text-black"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="location">
            <p className="font-semibold flex items-center gap-2">
              {locationName}
            </p>
            <p className="text-xs text-gray-500">{locationType}</p>
          </div>
        </div>

        {/* Publish Status */}
        <div className="publish">
          {isPublished ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="secondary">Unpublished</Badge>
          )}
        </div>

        {/* Address */}
        <div>
          <p className="text-gray-600">{address}</p>
          {roomNumber && (
            <p className="text-xs text-gray-500">Room: {roomNumber}</p>
          )}
        </div>

        {/* Fee */}
        <div>
          <p className="font-semibold">৳{consultationFee}</p>
        </div>

        {/* Active Days */}
        <div className="flex flex-wrap gap-1">
          {activeDays.filter((d) => d.isActive).length > 0 ? (
            activeDays
              .filter((d) => d.isActive)
              .map((d) => (
                <Badge
                  key={d.day}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {d.day?.slice(0, 3)}
                </Badge>
              ))
          ) : (
            <Badge className="bg-gray-100 text-gray-600">No Days</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="info" onClick={() => onEdit?.(id)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(id)}
          >
            Delete
          </Button>

          <Button
            size="sm"
            variant="default"
            disabled={isPublishing}
            onClick={handleTogglePublish}
            style={{ minWidth: "110px" }}
          >
            {isPublishing
              ? "Processing..."
              : isPublished
              ? "Unpublish"
              : "Publish"}
          </Button>
        </div>
      </div>

      {/* Expanded Row */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="px-4 pb-3">
              <table className="w-full text-sm border rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Day</th>
                    <th className="px-3 py-2 text-left">Start Time</th>
                    <th className="px-3 py-2 text-left">End Time</th>
                    <th className="px-3 py-2 text-left">Duration</th>
                    <th className="px-3 py-2 text-left">Slots</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDays.map((day) =>
                    day.timeSlots.map((slot, i) => (
                      <tr
                        key={`${day.day}-${i}`}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-3 py-2">{day.day}</td>
                        <td className="px-3 py-2">{slot.startTime}</td>
                        <td className="px-3 py-2">{slot.endTime}</td>
                        <td className="px-3 py-2">{slot.slotDuration} min</td>
                        <td className="px-3 py-2">{slot.capacity}</td>
                        <td className="px-3 py-2">
                          <Badge
                            className={
                              slot.slotActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {slot.slotActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-right flex gap-2 justify-end">
                          <Button size="sm" variant="default">
                            Deactivate
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultationItem;
