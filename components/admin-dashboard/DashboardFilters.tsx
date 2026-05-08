"use client";

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterParams {
  filter?: "today" | "week" | "month" | "year";
  from?: Date;
  to?: Date;
}
const PRESETS: Array<{ label: string; value: NonNullable<FilterParams["filter"]> }> = [
  { label: "Today", value: "today" },
  { label: "7D", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

function formatRangeLabel(range?: DateRange) {
  if (!range?.from) return "Custom range";
  if (range.from && !range.to) return format(range.from, "MMM d, yyyy");
  return `${format(range.from, "MMM d")} - ${format(range.to as Date, "MMM d, yyyy")}`;
}

export function DashboardFilters({
  onChange,
  activeFilter,
  activeFrom,
  activeTo,
}: {
  onChange: (params: FilterParams) => void;
  activeFilter?: string;
  activeFrom?: Date;
  activeTo?: Date;
}) {
  const initialRange = activeFrom && activeTo ? { from: activeFrom, to: activeTo } : undefined;
  const [range, setRange] = useState<DateRange | undefined>(
    initialRange
  );
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(initialRange);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(
    activeFrom && activeTo ? "custom" : activeFilter || "today"
  );

  const handlePreset = (value: string) => {
    if (!value) return;
    setSelectedPreset(value);
    setRange(undefined);
    setDraftRange(undefined);
    onChange({ filter: value as FilterParams["filter"] });
  };

  const handleRange = (nextRange: DateRange | undefined) => {
    setDraftRange(nextRange);
  };

  const applyRange = () => {
    if (!draftRange?.from || !draftRange?.to || draftRange.from > draftRange.to) {
      return;
    }

    setRange(draftRange);
    setSelectedPreset("custom");
    onChange({ from: draftRange.from, to: draftRange.to });
    setIsCalendarOpen(false);
  };

  const cancelRangeSelection = () => {
    setDraftRange(range);
    setIsCalendarOpen(false);
  };

  const clearFilters = () => {
    setRange(undefined);
    setDraftRange(undefined);
    setSelectedPreset("today");
    onChange({ filter: "today" });
  };

  return (
    <div className="w-full lg:w-auto">
      <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-2 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ToggleGroup
            type="single"
            value={selectedPreset}
            onValueChange={handlePreset}
            variant="outline"
            className="flex w-full flex-wrap justify-start"
            aria-label="Dashboard filter presets"
          >
            {PRESETS.map((preset) => (
              <ToggleGroupItem
                key={preset.value}
                value={preset.value}
                className="rounded-lg px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                aria-label={`Filter by ${preset.label}`}
              >
                {preset.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Popover
            open={isCalendarOpen}
            onOpenChange={(open) => {
              if (open) {
                setDraftRange(range);
              }
              setIsCalendarOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal sm:w-[220px]",
                  !range && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range ? formatRangeLabel(range) : "Pick date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={draftRange}
                onSelect={handleRange}
                numberOfMonths={2}
                initialFocus
                disabled={(date) => date > new Date()}
              />
              <div className="flex items-center justify-end gap-2 border-t p-3">
                <Button variant="ghost" size="sm" onClick={cancelRangeSelection}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={applyRange}
                  disabled={!draftRange?.from || !draftRange?.to}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            aria-label="Clear filters"
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-2 px-1">
          <Badge variant="secondary" className="rounded-full">
            {selectedPreset === "custom" ? "Custom" : selectedPreset}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {range?.from && range?.to ? formatRangeLabel(range) : "Using quick preset range"}
          </span>
        </div>
      </div>
    </div>
  );
}
