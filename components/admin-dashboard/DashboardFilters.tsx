"use client";

import { useState } from "react";

export interface FilterParams {
  filter?: "today" | "week" | "month" | "year";
  from?: Date;
  to?: Date;
}
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function DashboardFilters({ onChange, activeFilter }: { onChange: (params: FilterParams) => void, activeFilter?: string }) {
  const [range, setRange] = useState<any>();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(activeFilter || "today");

  const handlePreset = (f: string) => {
    setSelectedPreset(f);
    setRange(undefined); // reset range when preset is picked
    onChange({ filter: f });
  };

  const handleRange = (val: any) => {
    setRange(val);
    if (val?.from && val?.to) {
      // Debug log for date range selection
      console.log("Selected range:", val);
      setSelectedPreset(null); // clear preset highlight
      onChange({ from: val.from, to: val.to });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🔥 PRESET BUTTONS */}
      <div className="flex gap-2 mb-2" role="group" aria-label="Dashboard filter presets">
        {["today", "week", "month", "year"].map((f) => (
          <Button
            key={f}
            variant={selectedPreset === f ? "default" : "outline"}
            onClick={() => handlePreset(f)}
            className="rounded-xl"
            aria-pressed={selectedPreset === f}
            aria-label={`Filter by ${f}`}
          >
            {f}
          </Button>
        ))}
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedPreset("today");
            setRange(undefined);
            onChange({ filter: "today" });
          }}
          className="rounded-xl text-xs px-3"
          aria-label="Clear filters"
        >
          Clear
        </Button>
      </div>

      {/* 🔥 RANGE PICKER */}
      <Calendar
        mode="range"
        selected={range}
        onSelect={handleRange}
        className="rounded-xl border"
        aria-label="Select date range"
        disabled={(date) => date > new Date()}
      />
    </div>
  );
}
