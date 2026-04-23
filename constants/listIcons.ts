import type { MaterialIcons } from "@expo/vector-icons";

export type ListIconName = keyof typeof MaterialIcons.glyphMap;

export interface ListIconOption {
  label: string;
  name: ListIconName;
}

export const DEFAULT_LIST_ICON: ListIconName = "list";
export const INBOX_ICON: ListIconName = "inbox";

export const LIST_ICON_OPTIONS = [
  { label: "List", name: "list" },
  { label: "Work", name: "work" },
  { label: "Home", name: "home" },
  { label: "School", name: "school" },
  { label: "Shopping", name: "shopping-cart" },
  { label: "Food", name: "restaurant" },
  { label: "Coffee", name: "local-cafe" },
  { label: "Fitness", name: "fitness-center" },
  { label: "Running", name: "directions-run" },
  { label: "Wellbeing", name: "self-improvement" },
  { label: "Health", name: "health-and-safety" },
  { label: "Medical", name: "medical-services" },
  { label: "Money", name: "attach-money" },
  { label: "Savings", name: "savings" },
  { label: "Book", name: "book" },
  { label: "Bookmarks", name: "bookmarks" },
  { label: "Ideas", name: "lightbulb" },
  { label: "Star", name: "star" },
  { label: "Heart", name: "favorite" },
  { label: "Flag", name: "flag" },
  { label: "Pin", name: "push-pin" },
  { label: "Label", name: "label" },
  { label: "Archive", name: "archive" },
  { label: "Inventory", name: "inventory" },
  { label: "Calendar", name: "event" },
  { label: "Today", name: "today" },
  { label: "Schedule", name: "schedule" },
  { label: "Alarm", name: "alarm" },
  { label: "Travel", name: "flight" },
  { label: "Car", name: "directions-car" },
  { label: "Map", name: "map" },
  { label: "Place", name: "place" },
  { label: "World", name: "public" },
  { label: "Language", name: "language" },
  { label: "Music", name: "music-note" },
  { label: "Movies", name: "movie" },
  { label: "Games", name: "sports-esports" },
  { label: "Art", name: "palette" },
  { label: "Brush", name: "brush" },
  { label: "Build", name: "build" },
  { label: "Code", name: "code" },
  { label: "Computer", name: "computer" },
  { label: "Phone", name: "phone-iphone" },
  { label: "Mail", name: "mail" },
  { label: "People", name: "group" },
  { label: "Person", name: "person" },
  { label: "Lock", name: "lock" },
  { label: "Key", name: "key" },
  { label: "Pets", name: "pets" },
  { label: "Flowers", name: "local-florist" },
  { label: "Nature", name: "eco" },
  { label: "Sun", name: "wb-sunny" },
  { label: "Cloud", name: "cloud" },
  { label: "Energy", name: "bolt" },
  { label: "Trophy", name: "emoji-events" },
  { label: "Celebrate", name: "celebration" },
  { label: "Weekend", name: "weekend" },
  { label: "Bedroom", name: "bed" },
  { label: "Kitchen", name: "kitchen" },
  { label: "Garden", name: "yard" },
  { label: "Childcare", name: "child-care" },
  { label: "Laundry", name: "local-laundry-service" },
  { label: "Cleaning", name: "cleaning-services" },
  { label: "Spa", name: "spa" },
  { label: "Beach", name: "beach-access" },
  { label: "Science", name: "science" },
  { label: "Psychology", name: "psychology" },
] as const satisfies readonly ListIconOption[];

const VALID_LIST_ICON_NAMES = new Set<string>([
  INBOX_ICON,
  ...LIST_ICON_OPTIONS.map((option) => option.name),
]);

export const isListIconName = (iconName: unknown): iconName is ListIconName =>
  typeof iconName === "string" && VALID_LIST_ICON_NAMES.has(iconName);

export const getSafeListIconName = (
  iconName: unknown,
  fallback: ListIconName = DEFAULT_LIST_ICON
) => (isListIconName(iconName) ? iconName : fallback);
