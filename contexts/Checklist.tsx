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
  deleteItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
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
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "checklist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
