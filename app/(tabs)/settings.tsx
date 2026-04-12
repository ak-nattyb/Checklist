import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";

export default function SettingsScreen() {
  const { invertColors, setInvertColors } = useInvertColors();

  return (
    <ContentContainer contentGap={20} headerTitle="Settings" hideBackButton>
      <ToggleSwitch
        label="Invert Colors"
        onValueChange={setInvertColors}
        value={invertColors}
      />
    </ContentContainer>
  );
}
