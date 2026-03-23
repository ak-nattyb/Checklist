import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

interface ChecklistStore {
  items: ChecklistItem[];
  addItem: (text: string) => void;
  modifyItem: (id: string) => void;
  renameItem: (id: string, newText: string) => void;
  deleteItem: (id: string) => void;
  returnItemName: (id: string) => string;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (text) =>
        set((state) => ({
          items: [
            ...state.items,
            { id: Date.now().toString(), text, isChecked: false },
          ],
        })),
      modifyItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item,
          ),
        })),
      renameItem: (id, newText) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, text: newText } : item,
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      returnItemName: (id) => {
        const item = get().items.find((item) => item.id === id);
        return item?.text ?? "";
      },
    }),
    {
      name: "checklist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
