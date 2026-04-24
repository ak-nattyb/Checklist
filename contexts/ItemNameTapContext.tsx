import { createContext, type ReactNode, useContext } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";

export type ItemNameTapAction = "rename" | "toggle";

export const itemNameTapOptions: {
  label: string;
  value: ItemNameTapAction;
}[] = [
  { label: "Toggle", value: "toggle" },
  { label: "Rename", value: "rename" },
];

interface ItemNameTapContextType {
  itemNameTapAction: ItemNameTapAction;
  setItemNameTapAction: (value: ItemNameTapAction) => Promise<void>;
}

const ItemNameTapContext = createContext<ItemNameTapContextType>({
  itemNameTapAction: "toggle",
  setItemNameTapAction: () => {
    throw new Error("useItemNameTap must be used within ItemNameTapProvider");
  },
});

export const useItemNameTap = () => useContext(ItemNameTapContext);

export const ItemNameTapProvider = ({ children }: { children: ReactNode }) => {
  const [itemNameTapAction, setItemNameTapAction] =
    usePersistedState<ItemNameTapAction>("itemNameTapAction", "toggle");

  return (
    <ItemNameTapContext.Provider
      value={{ itemNameTapAction, setItemNameTapAction }}
    >
      {children}
    </ItemNameTapContext.Provider>
  );
};
