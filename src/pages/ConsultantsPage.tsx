import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import {
  weekDays,
  DEFAULT_LOCATION,
} from "@/components/registration/PracticeInfoStep";

// Components
import ConsultationSearchBar from "@/components/ConsultationSearchBar";
import ConsultationFilters from "@/components/ConsultationFilters";
import ConsultationList from "@/components/ConsultationList";
import PracticeInfoStep from "@/components/registration/PracticeInfoStep";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConsultationLocation } from "@/interface/doctor/doctorInterfaces";

// API
import {
  getConsultationLocations,
  addConsultationLocation,
  updateConsultationLocation,
  deleteConsultationLocation,
} from "@/api/auth";

const ConsultantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // -----------------------------
  // State
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [consultLocation, setConsultLocation] = useState("None");
  const [activeDay, setActiveDay] = useState("None");
  const [startTime, setStartTime] = useState("None");
  const [endTime, setEndTime] = useState("None");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState<ConsultationLocation[]>(
    []
  );
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [dayOptions, setDayOptions] = useState<string[]>([]);
  const [startTimeOptions, setStartTimeOptions] = useState<string[]>([]);
  const [endTimeOptions, setEndTimeOptions] = useState<string[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLocationData, setEditLocationData] =
    useState<ConsultationLocation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // -----------------------------
  // Form setup (NO VALIDATION SCHEMA)
  // -----------------------------
  const form = useForm({
    defaultValues: { consultationLocation: DEFAULT_LOCATION },
  });

  // -----------------------------
  // Fetch consultations
  // -----------------------------
  const fetchConsultations = async (filters: any) => {
    try {
      const response = await getConsultationLocations(filters);
      const data = response.data as ConsultationLocation[];

      setConsultations(data);

      // Build filter options on first load
      const locs = new Set<string>();
      const days = new Set<string>();
      const starts = new Set<string>();
      const ends = new Set<string>();

      data.forEach((loc) => {
        if (loc.locationName) locs.add(loc.locationName);

        loc.activeDays?.forEach((day) => {
          days.add(day.day);
          day.timeSlots?.forEach((slot) => {
            if (slot.startTime) starts.add(slot.startTime);
            if (slot.endTime) ends.add(slot.endTime);
          });
        });
      });

      if (!refreshFlag) {
        setLocationOptions(["None", ...Array.from(locs)]);
        setDayOptions(["None", ...Array.from(days)]);
        setStartTimeOptions(["None", ...Array.from(starts)]);
        setEndTimeOptions(["None", ...Array.from(ends)]);
        setRefreshFlag(true);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching consultations:", error);
    }
  };

  // Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        setIsLoading(true);
        setConsultLocation("None");
        setActiveDay("None");
        setStartTime("None");
        setEndTime("None");

        fetchConsultations({
          consultLocation,
          activeDay,
          startTime,
          endTime,
          search: query,
        });
      }, 500),
    [consultLocation, activeDay, startTime, endTime]
  );

  // Trigger search when searchQuery changes
  useEffect(() => {
    debouncedFetch(searchQuery);
    return () => debouncedFetch.cancel();
  }, [searchQuery, debouncedFetch]);

  // Initial fetch on mount
  useEffect(() => {
    fetchConsultations({
      consultLocation: "None",
      activeDay: "None",
      startTime: "None",
      endTime: "None",
      search: "",
    });
  }, []);

  // -----------------------------
  // Filters
  // -----------------------------
  const applyFilters = () => {
    setIsLoading(true);
    setSearchQuery(""); // reset search when applying filters
    fetchConsultations({
      consultLocation,
      activeDay,
      startTime,
      endTime,
      search: "",
    });
  };

  const clearFilters = () => {
    setConsultLocation("None");
    setActiveDay("None");
    setStartTime("None");
    setEndTime("None");
    setSearchQuery("");

    setIsLoading(true);
    fetchConsultations({
      consultLocation: "None",
      activeDay: "None",
      startTime: "None",
      endTime: "None",
      search: "",
    });
  };

  // -----------------------------
  // Add new location
  // -----------------------------
  const handleAddNewLocation = () => {
    setEditMode(false);
    setEditLocationData(null);
    form.reset({ consultationLocation: DEFAULT_LOCATION });
    setIsRegistrationModalOpen(true);
  };

  // -----------------------------
  // Edit location
  // -----------------------------
  const handleEditLocation = (id: number) => {
    const found = consultations.find((c) => c.id === id);
    if (!found) return;

    // Ensure all weekdays exist in activeDays
    const merged: ConsultationLocation = {
      ...DEFAULT_LOCATION,
      ...found,
      activeDays: weekDays.map((day) => {
        const match = found.activeDays.find((d) => d.day === day);
        return (
          match || {
            day,
            isActive: false,
            timeSlots: [],
          }
        );
      }),
    };

    setEditLocationData(found);
    setEditMode(true);
    form.reset({ consultationLocation: merged });
    setIsRegistrationModalOpen(true);
  };

  // -----------------------------
  // CUSTOM VALIDATION FUNCTION
  // -----------------------------
  const validateConsultationData = (
    locationData: ConsultationLocation
  ): boolean => {
    // Validate Location Name
    if (!locationData.locationName || locationData.locationName.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return false;
    }

    if (locationData.locationName.length < 3) {
      toast({
        title: "Validation Error",
        description: "Location name must be at least 3 characters",
        variant: "destructive",
      });
      return false;
    }

    // Validate Address
    if (!locationData.address || locationData.address.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive",
      });
      return false;
    }

    if (locationData.address.length < 5) {
      toast({
        title: "Validation Error",
        description: "Address must be at least 5 characters",
        variant: "destructive",
      });
      return false;
    }

    // Validate Location Type
    const validTypes = ["Hospital", "Clinic", "Chamber"];
    if (!validTypes.includes(locationData.locationType)) {
      toast({
        title: "Validation Error",
        description: "Invalid location type selected",
        variant: "destructive",
      });
      return false;
    }

    // Validate Consultation Fee
    if (
      locationData.consultationFee === undefined ||
      locationData.consultationFee === null
    ) {
      toast({
        title: "Validation Error",
        description: "Consultation fee is required",
        variant: "destructive",
      });
      return false;
    }

    if (locationData.consultationFee < 0) {
      toast({
        title: "Validation Error",
        description: "Consultation fee must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    // Validate Active Days
    const activeDays = locationData.activeDays.filter((day) => day.isActive);

    if (activeDays.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one active day is required",
        variant: "destructive",
      });
      return false;
    }

    // Validate Time Slots for each active day
    for (const day of activeDays) {
      if (!day.timeSlots || day.timeSlots.length === 0) {
        toast({
          title: "Validation Error",
          description: `${day.day} is marked active but has no time slots`,
          variant: "destructive",
        });
        return false;
      }

      for (let i = 0; i < day.timeSlots.length; i++) {
        const slot = day.timeSlots[i];

        // Validate Start Time
        if (!slot.startTime || slot.startTime.trim() === "") {
          toast({
            title: "Validation Error",
            description: `${day.day} - Time slot ${
              i + 1
            }: Start time is required`,
            variant: "destructive",
          });
          return false;
        }

        // Validate End Time
        if (!slot.endTime || slot.endTime.trim() === "") {
          toast({
            title: "Validation Error",
            description: `${day.day} - Time slot ${
              i + 1
            }: End time is required`,
            variant: "destructive",
          });
          return false;
        }

        // Validate End Time > Start Time
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (endMinutes <= startMinutes) {
          toast({
            title: "Validation Error",
            description: `${day.day} - Time slot ${
              i + 1
            }: End time must be after start time`,
            variant: "destructive",
          });
          return false;
        }

        // Validate Slot Duration
        if (!slot.slotDuration || slot.slotDuration <= 0) {
          toast({
            title: "Validation Error",
            description: `${day.day} - Time slot ${
              i + 1
            }: Slot duration must be greater than 0`,
            variant: "destructive",
          });
          return false;
        }

        if (slot.slotDuration > endMinutes - startMinutes) {
          toast({
            title: "Validation Error",
            description: `${day.day} - Time slot ${
              i + 1
            }: Slot duration is too long for the time range`,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  // -----------------------------
  // Save (add / update)
  // -----------------------------
  const handleSaveConsultation = async () => {
    console.log("🔥 SAVE TRIGGERED - Function called!");

    const formData = form.getValues();
    console.log("📋 Form Data:", formData);

    const locationData = formData.consultationLocation;
    console.log("📍 Location Data:", locationData);

    // Run validation
    if (!validateConsultationData(locationData)) {
      console.log("❌ Validation failed");
      return; // Stop if validation fails
    }

    console.log("✅ Validation passed, proceeding to save...");

    try {
      setIsLoading(true);

      if (editMode && editLocationData) {
        console.log("📝 UPDATE mode, ID:", editLocationData.id);
        // UPDATE
        await updateConsultationLocation(editLocationData.id, locationData);

        toast({
          title: "Location updated",
          description: "Location details successfully updated.",
        });
      } else {
        console.log("➕ CREATE mode");
        // CREATE
        await addConsultationLocation(locationData);

        toast({
          title: "Location added",
          description: "New location has been saved.",
        });
      }

      setEditMode(false);
      setEditLocationData(null);
      setIsRegistrationModalOpen(false);

      // Refresh list
      fetchConsultations({
        consultLocation: "None",
        activeDay: "None",
        startTime: "None",
        endTime: "None",
        search: "",
      });
    } catch (error) {
      console.error("💥 Error saving consultation:", error);
      toast({
        title: "Error",
        description: "Failed to save location.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Delete location
  // -----------------------------
  const handleDeleteLocation = (id: number) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsLoading(true);

      await deleteConsultationLocation(deleteId);

      toast({
        title: "Location Deleted",
        description: "The consultation location has been removed.",
      });

      setDeleteId(null);
      setIsDeleteConfirmOpen(false);

      fetchConsultations({
        consultLocation: "None",
        activeDay: "None",
        startTime: "None",
        endTime: "None",
        search: "",
      });
    } catch (error) {
      console.error("Error deleting location:", error);
      toast({
        title: "Error",
        description: "Failed to delete location.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Consultation Locations</h1>

        <div className="space-y-4">
          {/* Search bar */}
          <ConsultationSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onMenuToggle={() => setShowFilters(!showFilters)}
            onAddNewLocation={handleAddNewLocation}
          />

          {showFilters && (
            <ConsultationFilters
              location={consultLocation}
              setLocation={setConsultLocation}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              locationOptions={locationOptions}
              dayOptions={dayOptions}
              startTimeOptions={startTimeOptions}
              endTimeOptions={endTimeOptions}
            />
          )}
        </div>
      </div>

      {/* List */}
      <ConsultationList
        consultations={consultations}
        isLoading={isLoading}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
      />

      {/* Add / Edit Modal */}
      <Dialog
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Location" : "Add New Location"}
            </DialogTitle>
            <DialogDescription>
              Fill out the consultation details below and save.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <PracticeInfoStep
              onCancel={() => setIsRegistrationModalOpen(false)}
              onSubmit={handleSaveConsultation}
              buttonLabel={
                editMode ? "Update Branch Details" : "Save Branch Details"
              }
            />
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this location? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultantsPage;
