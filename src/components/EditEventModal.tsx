import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { format, parse } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Event } from "../pages/CalendarPage";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
}

const eventTypes = [
  { value: "Appointment", label: "Appointment" },
  { value: "Meeting", label: "Meeting" },
  { value: "Personal", label: "Personal" },
  { value: "Other", label: "Other" },
];

const reminderOptions = [
  { value: "0", label: "At time of event" },
  { value: "1", label: "5 minutes before" },
  { value: "2", label: "15 minutes before" },
  { value: "3", label: "30 minutes before" },
  { value: "4", label: "1 hour before" },
  { value: "5", label: "1 day before" },
];

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isAllDay, setIsAllDay] = useState(0);
  const [startTime, setStartTime] = useState(format(date, "HH:mm"));
  const [endTime, setEndTime] = useState(format(date, "HH:mm"));

  const form = useForm({
    defaultValues: {
      title: "",
      location: "",
      type: eventTypes[0].value,
      reminder: reminderOptions[0].value,
    },
  });

  // Reset form when event changes
  useEffect(() => {
    if (event) {
      setIsAllDay(event.allDay);

      form.reset({
        title: event.title,
        location: event.location,
        type: event.eventType,
        reminder: event.reminderType.toString(),
      });
    }
  }, [event, form]);

  const handleUpdateEvent = (data: any) => {
    if (!event) return;

    const startDateTime = parse(
      `${format(date, "yyyy-MM-dd")} ${startTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const endDateTime = parse(
      `${format(date, "yyyy-MM-dd")} ${endTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    // Create updated event object
    const updatedEvent: Event = {
      id: event.id,
      dateFrom: isAllDay ? new Date(date.setHours(0, 0, 0, 0)) : startDateTime,
      dateTo: isAllDay ? new Date(date.setHours(23, 59, 59, 999)) : endDateTime,
      allDay: isAllDay,
      title: data.title,
      eventType: data.type,
      location: data.location,
      reminderType: Number(data.reminder),
    };

    // Update the event
    onUpdateEvent(updatedEvent);
    onClose();
  };

  const handleDeleteEvent = () => {
    if (event) {
      onDeleteEvent(event.id);
      onClose();
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateEvent)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-1 lg:grid-cols-2">
              {/* Date picker */}
              <div className="grid col-span-1  gap-4">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* All day switch */}
              <div className="flex items-center space-x-2 justify-self-end">
                <Switch
                  id="all-day"
                  checked={isAllDay === 0 ? false : true}
                  onCheckedChange={setIsAllDay}
                />
                <Label htmlFor="all-day">All day</Label>
              </div>
            </div>

            {/* Time slots (hidden if all day is selected) */}
            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time-from">From</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    <Input
                      id="time-from"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="time-to">To</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    <Input
                      id="time-to"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Event type dropdown */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event location" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Reminder dropdown */}
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reminderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteEvent}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
