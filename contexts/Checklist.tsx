import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistStore {
  items: ChecklistItem[];
  addItem: (text: string) => void;
  deleteItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      items: [
        { id: "1", text: "Checklist Item 1" },
        { id: "2", text: "Checklist Item 2" },
        { id: "3", text: "Checklist Item 3" },
        { id: "4", text: "Checklist Item 4" },
        { id: "5", text: "Checklist Item 5" },
        { id: "6", text: "Checklist Item 6" },
        { id: "7", text: "Checklist Item 7" },
        { id: "8", text: "Checklist Item 8" },
        { id: "9", text: "Checklist Item 9" },
        { id: "10", text: "Checklist Item 10" },
      ],
      addItem: (text) =>
        set((state) => ({
          items: [...state.items, { id: Date.now().toString(), text }],
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
