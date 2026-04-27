import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_LIST_ICON,
  getSafeListIconName,
  INBOX_ICON,
  type ListIconName,
} from "@/constants/listIcons";

export interface ChecklistList {
  iconName: ListIconName;
  id: string;
  name: string;
}

export interface ChecklistItem {
  id: string;
  isChecked: boolean;
  listId: string;
  text: string;
}

interface ChecklistStore {
  activeListId: string;
  addItem: (text: string, listId: string) => string;
  addRecurringItem: (
    text: string,
    listId: string,
    recurringIncrement: string,
  ) => string;
  addList: (name: string) => string;
  changeListIcon: (id: string, iconName: ListIconName) => void;
  deleteItem: (id: string) => void;
  deleteItems: (ids: string[]) => void;
  deleteList: (id: string) => void;
  duplicateItem: (id: string) => string | undefined;
  duplicateList: (id: string) => string | undefined;
  getItemsForList: (listId: string) => ChecklistItem[];
  getListName: (id: string) => string;
  items: ChecklistItem[];
  lists: ChecklistList[];
  moveItem: (id: string, listId: string) => void;
  moveItemWithinList: (id: string, direction: "down" | "up") => void;
  moveList: (id: string, direction: "down" | "up") => void;
  renameItem: (id: string, text: string) => void;
  renameList: (id: string, name: string) => void;
  setActiveListId: (id: string) => void;
  toggleItem: (id: string) => void;
}

interface OldChecklistEntry {
  id: string;
  isChecked?: boolean;
  kind: "folder" | "item";
  location: string;
  text: string;
}

interface PersistedChecklistState {
  activeFolderId?: string;
  activeListId?: string;
  entries?: OldChecklistEntry[];
  items?: ChecklistItem[];
  lists?: ChecklistList[];
}

type PersistedState = Pick<ChecklistStore, "activeListId" | "items" | "lists">;

const STORAGE_VERSION = 6;
export const INBOX_LIST_ID = "inbox";
const INBOX_NAME = "Inbox";
const INBOX_LIST: ChecklistList = {
  iconName: INBOX_ICON,
  id: INBOX_LIST_ID,
  name: INBOX_NAME,
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ensureUniqueId = (
  candidate: string | undefined,
  usedIds: Set<string>,
) => {
  const baseId = candidate?.trim() || makeId();
  let id = baseId;
  let suffix = 1;

  while (usedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
};

const cleanName = (name: string | undefined, fallback: string) => {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

export const isInboxList = (id: string) => id === INBOX_LIST_ID;

const cleanList = (list: ChecklistList): ChecklistList => ({
  ...list,
  iconName: isInboxList(list.id)
    ? INBOX_ICON
    : getSafeListIconName(list.iconName),
  name: isInboxList(list.id) ? INBOX_NAME : list.name,
});

const ensureInboxList = (state: PersistedState): PersistedState => {
  const lists = state.lists.map(cleanList);
  const inboxById = lists.find((list) => list.id === INBOX_LIST_ID);
  if (inboxById) {
    return {
      ...state,
      lists: [inboxById, ...lists.filter((list) => list.id !== INBOX_LIST_ID)],
    };
  }

  const inboxByName = lists.find((list) => list.name === INBOX_NAME);
  if (inboxByName) {
    return {
      activeListId:
        state.activeListId === inboxByName.id
          ? INBOX_LIST_ID
          : state.activeListId,
      items: state.items.map((item) =>
        item.listId === inboxByName.id
          ? { ...item, listId: INBOX_LIST_ID }
          : item,
      ),
      lists: [
        { ...inboxByName, iconName: INBOX_ICON, id: INBOX_LIST_ID },
        ...lists.filter((list) => list.id !== inboxByName.id),
      ],
    };
  }

  return {
    ...state,
    lists: [INBOX_LIST, ...lists],
  };
};

const isChecklistList = (value: unknown): value is ChecklistList =>
  Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as ChecklistList).id === "string" &&
    typeof (value as ChecklistList).name === "string",
  );

const isChecklistItem = (value: unknown): value is ChecklistItem =>
  Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as ChecklistItem).id === "string" &&
    typeof (value as ChecklistItem).text === "string" &&
    typeof (value as ChecklistItem).listId === "string",
  );

const isOldChecklistEntry = (value: unknown): value is OldChecklistEntry =>
  Boolean(
    value &&
    typeof value === "object" &&
    ((value as OldChecklistEntry).kind === "folder" ||
      (value as OldChecklistEntry).kind === "item") &&
    typeof (value as OldChecklistEntry).id === "string" &&
    typeof (value as OldChecklistEntry).text === "string",
  );

const migrateCurrentState = (
  state: PersistedChecklistState,
): PersistedState => {
  const usedIds = new Set<string>();
  const lists = (state.lists ?? []).filter(isChecklistList).map((list) => ({
    iconName: getSafeListIconName(list.iconName),
    id: ensureUniqueId(list.id, usedIds),
    name: cleanName(list.name, "Untitled List"),
  }));
  const validListIds = new Set(lists.map((list) => list.id));
  const items = (state.items ?? [])
    .filter(isChecklistItem)
    .filter((item) => validListIds.has(item.listId))
    .map((item) => ({
      id: ensureUniqueId(item.id, usedIds),
      isChecked: Boolean(item.isChecked),
      listId: item.listId,
      text: cleanName(item.text, "Untitled Item"),
    }));
  const activeListId = validListIds.has(state.activeListId ?? "")
    ? (state.activeListId ?? "")
    : "";

  return ensureInboxList({ activeListId, items, lists });
};

const migrateOldEntries = (state: PersistedChecklistState): PersistedState => {
  const entries = (state.entries ?? []).filter(isOldChecklistEntry);
  const usedIds = new Set<string>();
  const listIdByName = new Map<string, string>();
  const listIdByOldId = new Map<string, string>();
  const lists: ChecklistList[] = [];

  for (const entry of entries) {
    if (entry.kind !== "folder") {
      continue;
    }

    const name = cleanName(entry.text, "Untitled List");
    const id = ensureUniqueId(entry.id, usedIds);
    lists.push({ iconName: DEFAULT_LIST_ICON, id, name });
    listIdByOldId.set(entry.id, id);

    if (!listIdByName.has(name)) {
      listIdByName.set(name, id);
    }
  }

  const getInboxId = () => {
    const existingInboxId = listIdByName.get(INBOX_NAME);
    if (existingInboxId) {
      return existingInboxId;
    }

    const id = ensureUniqueId(INBOX_LIST_ID, usedIds);
    lists.push({ iconName: INBOX_ICON, id, name: INBOX_NAME });
    listIdByName.set(INBOX_NAME, id);
    return id;
  };

  const items = entries
    .filter((entry) => entry.kind === "item")
    .map((entry) => {
      const location = cleanName(entry.location, "");
      const listId = location ? listIdByName.get(location) : undefined;

      return {
        id: ensureUniqueId(entry.id, usedIds),
        isChecked: Boolean(entry.isChecked),
        listId: listId ?? getInboxId(),
        text: cleanName(entry.text, "Untitled Item"),
      };
    });

  const activeListId = listIdByOldId.get(state.activeFolderId ?? "") ?? "";

  return ensureInboxList({ activeListId, items, lists });
};

export const migrateChecklistState = (
  persistedState: unknown,
): PersistedState => {
  if (!persistedState || typeof persistedState !== "object") {
    return ensureInboxList({ activeListId: "", items: [], lists: [] });
  }

  const state = persistedState as PersistedChecklistState;

  if (Array.isArray(state.lists) && Array.isArray(state.items)) {
    return migrateCurrentState(state);
  }

  return migrateOldEntries(state);
};

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      activeListId: "",
      items: [],
      lists: [INBOX_LIST],

      addItem: (text, listId) => {
        const id = makeId();
        set((state) => ({
          items: [
            ...state.items,
            {
              id,
              isChecked: false,
              listId,
              text: cleanName(text, "Untitled Item"),
            },
          ],
        }));
        return id;
      },

      addRecurringItem: (text, listId, recurringIncrement) => {
        const id = makeId();
        set((state) => ({
          items: [
            ...state.items,
            {
              id,
              isChecked: false,
              listId,
              recurringIncrement,
              text: cleanName(text, "Untitled Item"),
            },
          ],
        }));
        return id;
      },

      addList: (name) => {
        const id = makeId();
        set((state) => ({
          lists: [
            ...state.lists,
            {
              iconName: DEFAULT_LIST_ICON,
              id,
              name: cleanName(name, "Untitled List"),
            },
          ],
        }));
        return id;
      },

      changeListIcon: (id, iconName) => {
        if (isInboxList(id)) {
          return;
        }

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, iconName: getSafeListIconName(iconName) }
              : list,
          ),
        }));
      },

      deleteItem: (id) => {
        get().deleteItems([id]);
      },

      deleteItems: (ids) => {
        const idsToDelete = new Set(ids.filter(Boolean));
        if (idsToDelete.size === 0) {
          return;
        }

        set((state) => ({
          items: state.items.filter((item) => !idsToDelete.has(item.id)),
        }));
      },

      deleteList: (id) => {
        if (isInboxList(id)) {
          return;
        }

        set((state) => ({
          activeListId: state.activeListId === id ? "" : state.activeListId,
          items: state.items.filter((item) => item.listId !== id),
          lists: state.lists.filter((list) => list.id !== id),
        }));
      },

      duplicateItem: (id) => {
        const item = get().items.find((candidate) => candidate.id === id);
        if (!item) {
          return undefined;
        }

        const newItemId = makeId();
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: newItemId,
              text: `${item.text} Copy`,
            },
          ],
        }));
        return newItemId;
      },

      duplicateList: (id) => {
        if (isInboxList(id)) {
          return undefined;
        }

        const list = get().lists.find((candidate) => candidate.id === id);
        if (!list) {
          return undefined;
        }

        const newListId = makeId();
        const sourceItems = get().items.filter((item) => item.listId === id);
        set((state) => ({
          items: [
            ...state.items,
            ...sourceItems.map((item) => ({
              ...item,
              id: makeId(),
              listId: newListId,
            })),
          ],
          lists: [
            ...state.lists,
            {
              iconName: getSafeListIconName(list.iconName),
              id: newListId,
              name: `${list.name} Copy`,
            },
          ],
        }));
        return newListId;
      },

      getItemsForList: (listId) =>
        get().items.filter((item) => item.listId === listId),

      getListName: (id) =>
        get().lists.find((list) => list.id === id)?.name ?? "",

      moveItem: (id, listId) =>
        set((state) => {
          if (!state.lists.some((list) => list.id === listId)) {
            return state;
          }

          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, listId } : item,
            ),
          };
        }),

      moveItemWithinList: (id, direction) =>
        set((state) => {
          const item = state.items.find((candidate) => candidate.id === id);
          if (!item) {
            return state;
          }

          const listItems = state.items.filter(
            (candidate) => candidate.listId === item.listId,
          );
          const currentIndex = listItems.findIndex(
            (candidate) => candidate.id === id,
          );

          if (currentIndex < 0) {
            return state;
          }

          const targetIndex =
            direction === "up"
              ? Math.max(0, currentIndex - 1)
              : Math.min(listItems.length - 1, currentIndex + 1);

          if (targetIndex === currentIndex) {
            return state;
          }

          const reorderedListItems = [...listItems];
          [reorderedListItems[currentIndex], reorderedListItems[targetIndex]] =
            [reorderedListItems[targetIndex], reorderedListItems[currentIndex]];

          let reorderedIndex = 0;

          return {
            items: state.items.map((candidate) =>
              candidate.listId === item.listId
                ? reorderedListItems[reorderedIndex++]
                : candidate,
            ),
          };
        }),

      moveList: (id, direction) =>
        set((state) => {
          if (isInboxList(id)) {
            return state;
          }

          const currentIndex = state.lists.findIndex((list) => list.id === id);
          if (currentIndex < 0) {
            return state;
          }

          const targetIndex =
            direction === "up"
              ? Math.max(1, currentIndex - 1)
              : Math.min(state.lists.length - 1, currentIndex + 1);

          if (targetIndex === currentIndex) {
            return state;
          }

          const nextLists = [...state.lists];
          [nextLists[currentIndex], nextLists[targetIndex]] = [
            nextLists[targetIndex],
            nextLists[currentIndex],
          ];

          return {
            lists: nextLists,
          };
        }),

      renameItem: (id, text) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, text: cleanName(text, "Untitled Item") }
              : item,
          ),
        })),

      renameList: (id, name) => {
        if (isInboxList(id)) {
          return;
        }

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, name: cleanName(name, "Untitled List") }
              : list,
          ),
        }));
      },

      setActiveListId: (id) => set({ activeListId: id }),

      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item,
          ),
        })),
    }),
    {
      migrate: migrateChecklistState,
      name: "checklist-storage",
      partialize: (state) => ({
        activeListId: state.activeListId,
        items: state.items,
        lists: state.lists,
      }),
      storage: createJSONStorage(() => AsyncStorage),
      version: STORAGE_VERSION,
    },
  ),
);
