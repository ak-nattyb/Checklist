import React from "react";
import { OptionsSelector } from "@/components/OptionsSelector";
import { useDisplayMode, DisplayMode } from "@/contexts/DisplayModeContext";

const OPTIONS = [
  { label: "Large", value: "Lg" },
  { label: "Medium", value: "Md" },
  { label: "Small", value: "Sm" },
];

export default function DisplayModeScreen() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  return (
    <OptionsSelector
      title="Display Mode"
      options={OPTIONS}
      selectedValue={displayMode.toString()}
      onSelect={(value) => setDisplayMode(value as DisplayMode)}
    />
  );
}
