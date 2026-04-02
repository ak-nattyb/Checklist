import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BaseEntry {
  id: string;
  text: string;
  location: string;
}

export interface ChecklistItem extends BaseEntry {
  kind: "item";
  isChecked: boolean;
}

export interface ChecklistFolder extends BaseEntry {
  kind: "folder";
}

export interface RecurringChecklistItem extends BaseEntry {
  kind: "recurringitem";
  isChecked: boolean;
  recurring: string;
}

export type ChecklistEntry =
  | ChecklistItem
  | ChecklistFolder
  | RecurringChecklistItem;

// --- Store ---

interface ChecklistStore {
  entries: ChecklistEntry[];

  //shared
  renameEntry: (id: string, newText: string) => void;
  deleteEntry: (id: string) => void;
  moveEntry: (id: string, newLocation: string) => void;
  getEntry: (id: string) => ChecklistEntry | undefined;
  getNumEntries: () => number;
  getEntryName: (id: string) => string;

  //Items
  addItem: (text: string, location?: string) => void;
  toggleItem: (id: string) => void;
  deleteCheckedItemsInFolder: (location: string) => void;

  //Folders
  addFolder: (text: string, location?: string) => void;

  //RecurringItems
  addRecurringItem: (
    text: string,
    recurring: string,
    location?: string,
  ) => void;

  //navigation
  activeFolderId: string;
  setActiveFolderId: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      entries: [],

      // Shared actions
      renameEntry: (id, newText) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, text: newText } : e,
          ),
        })),

      deleteEntry: (id) =>
        set((state) => {
          // Find the entry being deleted
          const target = state.entries.find((e) => e.id === id);

          // If it's a folder, also delete all direct children
          if (target?.kind === "folder") {
            return {
              entries: state.entries.filter(
                (e) => e.id !== id && e.location !== target.text,
              ),
            };
          }

          return { entries: state.entries.filter((e) => e.id !== id) };
        }),

      moveEntry: (id, newLocation) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, location: newLocation } : e,
          ),
        })),

      getEntry: (id) => get().entries.find((e) => e.id === id),

      getNumEntries: () => get().entries.length,

      getEntryName: (id) => get().entries.find((e) => e.id === id)?.text ?? "",

      // Item actions
      addItem: (text, location) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: state.entries.length.toString() + Date.now().toString(),
              kind: "item",
              text,
              isChecked: false,
              location:
                location ??
                (get().activeFolderId
                  ? get().getEntryName(get().activeFolderId)
                  : ""),
            },
          ],
        })),

      toggleItem: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id && (e.kind === "item" || e.kind === "recurringitem")
              ? { ...e, isChecked: !e.isChecked }
              : e,
          ),
        })),

      deleteCheckedItemsInFolder: (location) =>
        set((state) => ({
          entries: state.entries.filter(
            (e) =>
              !(e.location === location && e.kind === "item" && e.isChecked),
          ),
        })),

      // Folder actions
      addFolder: (text, location = "") =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: state.entries.length.toString() + Date.now().toString(),
              kind: "folder",
              text,
              location:
                location ??
                (get().activeFolderId
                  ? get().getEntryName(get().activeFolderId)
                  : ""),
            },
          ],
        })),

      // Recurring Item actions
      addRecurringItem: (text, recurring, location) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: state.entries.length.toString() + Date.now().toString(),
              kind: "recurringitem",
              recurring,
              text,
              isChecked: false,
              location:
                location ??
                (get().activeFolderId
                  ? get().getEntryName(get().activeFolderId)
                  : ""),
            },
          ],
        })),

      //navigation
      activeFolderId: "",
      setActiveFolderId: (id) => set({ activeFolderId: id }),
    }),
    {
      name: "checklist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
