import { useChecklistStore } from "@/contexts/ChecklistContext";

// In your store file or a hooks file
export const useHasCheckedItems = (location?: string) =>
  useChecklistStore((state) => {
    const loc = location ?? state.getEntryName(state.activeFolderId);
    return state.entries.some(
      (e) => e.kind === "item" && e.isChecked && e.location === loc
    );
  });