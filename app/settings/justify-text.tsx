import React from "react";
import { OptionsSelector } from "@/components/OptionsSelector";
import { useJustifyText, JustifyText } from "@/contexts/JustifyTextContext";

const OPTIONS = [
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
];

export default function JustifyTextScreen() {
  const { justifyText, setJustifyText } = useJustifyText();

  return (
    <OptionsSelector
      title="Justify Text"
      options={OPTIONS}
      selectedValue={justifyText.toString()}
      onSelect={(value) => setJustifyText(value as JustifyText)}
    />
  );
}
