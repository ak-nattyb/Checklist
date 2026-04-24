import { OptionsSelector } from "@/components/OptionsSelector";
import {
  type ItemNameTapAction,
  itemNameTapOptions,
  useItemNameTap,
} from "@/contexts/ItemNameTapContext";

export default function ItemNameTapScreen() {
  const { itemNameTapAction, setItemNameTapAction } = useItemNameTap();

  return (
    <OptionsSelector
      onSelect={(value) => setItemNameTapAction(value as ItemNameTapAction)}
      options={itemNameTapOptions}
      selectedValue={itemNameTapAction}
      title="Item name tap"
    />
  );
}
