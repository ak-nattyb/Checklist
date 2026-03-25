import React from "react";
import { OptionsSelector } from "@/components/OptionsSelector";
import { useJustifyText, JustifyText } from "@/contexts/JustifyTextContext";

const OPTIONS = [
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
];

export default function DisplayModeScreen() {
  const { justifyText, setJustifyText } = useJustifyText();

  return (
    <OptionsSelector
      title="Display Mode"
      options={OPTIONS}
      selectedValue={justifyText.toString()}
      onSelect={(value) => setJustifyText(value as JustifyText)}
    />
  );
}
