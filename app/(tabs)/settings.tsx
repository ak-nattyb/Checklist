import { nativeApplicationVersion } from "expo-application";
import ContentContainer from "@/components/ContentContainer";
import { SelectorButton } from "@/components/SelectorButton";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import {
  itemNameTapOptions,
  useItemNameTap,
} from "@/contexts/ItemNameTapContext";

export default function SettingsScreen() {
  const { invertColors, setInvertColors } = useInvertColors();
  const { itemNameTapAction } = useItemNameTap();
  const version = nativeApplicationVersion;
  const itemNameTapLabel =
    itemNameTapOptions.find((option) => option.value === itemNameTapAction)
      ?.label ?? "Toggle";

  return (
    <ContentContainer
      contentGap={20}
      headerTitle={`Settings (v${version})`}
      hideBackButton
    >
      <ToggleSwitch
        label="Invert Colors"
        onValueChange={setInvertColors}
        value={invertColors}
      />
      <SelectorButton
        href="/item-name-tap"
        label="Item name tap"
        value={itemNameTapLabel}
      />
    </ContentContainer>
  );
}
