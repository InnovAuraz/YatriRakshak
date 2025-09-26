import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export 

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month,
        caption justify-center pt-1 relative items-center",
        caption_label font-medium",
        nav flex items-center",
        nav_button
          buttonVariants({ variant }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous left-1",
        nav_button_next right-1",
        table border-collapse space-y-1",
        head_row,
        head_cell rounded-md w-9 font-normal text-[0.8rem]",
        row w-full mt-2",
        cell w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day variant }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end,
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled opacity-50",
        day_range_middle aria-selected:text-accent-foreground",
        day_hidden,
        ...classNames,
      }}
      components={{
        IconLeft ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

