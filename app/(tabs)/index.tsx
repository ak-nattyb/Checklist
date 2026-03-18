import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { useChecklistStore } from "@/contexts/Checklist";

export default function Tab() {
  const { items, deleteItem } = useChecklistStore();

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
