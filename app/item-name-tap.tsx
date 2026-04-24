import { OptionsSelector } from "@/components/OptionsSelector";
import {
  itemNameTapOptions,
  useItemNameTap,
} from "@/contexts/ItemNameTapContext";

export default function ItemNameTapScreen() {
  const { itemNameTapAction, setItemNameTapAction } = useItemNameTap();

  return (
    <OptionsSelector
      onSelect={setItemNameTapAction}
      options={itemNameTapOptions}
      selectedValue={itemNameTapAction}
      title="Item name tap"
    />
  );
}
