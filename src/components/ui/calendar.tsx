import * as React from "react";
import { DayPicker, useNavigation } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

// shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  fromYear?: number;
  toYear?: number;
};

function CaptionWithSelects({
  displayMonth,
  fromYear = 2000,
  toYear = 2035,
}: {
  displayMonth: Date;
  fromYear?: number;
  toYear?: number;
}) {
  const { goToMonth } = useNavigation();

  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) =>
        new Date(2020, m, 1).toLocaleString(undefined, { month: "long" })
      ),
    []
  );

  const years = React.useMemo(
    () => Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i),
    [fromYear, toYear]
  );

  const currentMonthIndex = displayMonth.getMonth();
  const currentYear = displayMonth?.getFullYear();

  return (
    <div className="flex items-center justify-center gap-2 py-2 relative">
      {/* Month dropdown */}
      <Select
        value={String(currentMonthIndex)}
        onValueChange={(val) => {
          const next = new Date(displayMonth);
          next.setMonth(parseInt(val, 10));
          goToMonth(next);
        }}
      >
        <SelectTrigger className="h-8 w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((label, idx) => (
            <SelectItem key={idx} value={String(idx)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year dropdown */}
      <Select
        value={String(currentYear)}
        onValueChange={(val) => {
          const next = new Date(displayMonth);
          next.setFullYear(parseInt(val, 10));
          goToMonth(next);
        }}
      >
        <SelectTrigger className="h-8 w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function Calendar({
  className,
  fromYear = 2000,
  toYear = 2035,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-2", className)}
      showOutsideDays
      // We use our own caption with working dropdowns:
      components={{
        Caption: (captionProps) => (
          <CaptionWithSelects
            displayMonth={captionProps.displayMonth}
            fromYear={fromYear}
            toYear={toYear}
          />
        ),
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-2",
        caption: "pt-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        nav: "space-x-1 flex items-center absolute right-2 top-2",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md",
      }}
      // keep available years bounded:
      fromMonth={new Date(fromYear, 0, 1)}
      toMonth={new Date(toYear, 11, 31)}
      {...props}
    />
  );
}

export default Calendar;
