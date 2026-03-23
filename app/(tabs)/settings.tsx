import React from "react";
import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { SelectorButton } from "@/components/SelectorButton";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

const DISPLAY_MODE_LABELS: Record<string, string> = {
  standard: "Standard",
  compact: "Compact",
  comfortable: "Comfortable",
};

export default function SettingsScreen() {
  const { invertColors, setInvertColors } = useInvertColors();
  const { displayMode } = useDisplayMode();

  return (
    <ContentContainer headerTitle="Settings">
      <SelectorButton
        label="Display Mode"
        value={DISPLAY_MODE_LABELS[displayMode]}
        href="/settings/display-mode"
      />
      <ToggleSwitch
        value={invertColors}
        label="Invert Colours"
        onValueChange={setInvertColors}
      />
    </ContentContainer>
  );
}
