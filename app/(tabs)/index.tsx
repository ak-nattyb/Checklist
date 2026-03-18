import { useState } from "react"; // Add this import
import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";

const initialChecklistItems = [
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
];

export default function Tab() {
  const [items, setItems] = useState(initialChecklistItems);

  function deleteItem(id: string): void {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <ContentContainer
      headerTitle="List Items"
      hideBackButton
      style={{ paddingHorizontal: n(20) }}
    >
      <CustomScrollView
        data={items}
        renderItem={({ item }) => (
          <ChecklistItem
            text={item.text}
            onDelete={() => deleteItem(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: n(28) }}
      />
    </ContentContainer>
  );
}
