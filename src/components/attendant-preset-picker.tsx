"use client";

import { useState } from "react";
import {
  ATTENDANT_PRESET_CATEGORIES,
  ATTENDANT_PRESET_CATEGORY_LABELS,
  getPresetsForCategory,
  type AttendantPreset,
  type AttendantPresetCategory,
} from "@/lib/attendant/presets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  activePresetId?: string;
  activeCategory?: AttendantPresetCategory;
  onSelect: (preset: AttendantPreset) => void;
};

export function AttendantPresetPicker({
  activePresetId,
  activeCategory,
  onSelect,
}: Props) {
  const [tab, setTab] = useState<AttendantPresetCategory>("general");
  const tabValue = activeCategory ?? tab;

  return (
    <Tabs
      value={tabValue}
      onValueChange={(v) => setTab(v as AttendantPresetCategory)}
    >
      <TabsList className="w-full sm:w-auto">
        {ATTENDANT_PRESET_CATEGORIES.map((category) => (
          <TabsTrigger key={category} value={category} className="flex-1 sm:flex-none">
            {ATTENDANT_PRESET_CATEGORY_LABELS[category]}
          </TabsTrigger>
        ))}
      </TabsList>

      {ATTENDANT_PRESET_CATEGORIES.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid gap-2 sm:grid-cols-2">
            {getPresetsForCategory(category).map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelect(preset)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="block text-sm font-medium">{preset.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
