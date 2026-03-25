import React from "react";
import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { SelectorButton } from "@/components/SelectorButton";
import { useDisplayMode } from "@/contexts/DisplayModeContext";
import { n } from "@/utils/scaling";

const DISPLAY_MODE_LABELS: Record<string, string> = {
  Lg: "Large",
  Md: "Medium",
  Sm: "Small",
};

const JUSTIFY_TEXT_LABELS: Record<string, string> = {
  Left: "Left",
  Right: "Right",
};

export default function SettingsScreen() {
  const { invertColors, setInvertColors } = useInvertColors();
  const { displayMode } = useDisplayMode();

  return (
    <ContentContainer headerTitle="Settings" style={{ gap: n(20) }}>
      <SelectorButton
        label="Display Mode"
        value={DISPLAY_MODE_LABELS[displayMode]}
        href="/settings/display-mode"
      />
      <SelectorButton
        label="Justify List"
        value={JUSTIFY_TEXT_LABELS[displayMode]}
        href="/settings/display-mode"
      />
      <ToggleSwitch
        value={invertColors}
        label="Invert Colors"
        onValueChange={setInvertColors}
      />
    </ContentContainer>
  );
}
