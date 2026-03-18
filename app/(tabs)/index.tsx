import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { useChecklistStore } from "@/contexts/Checklist";

export default function Tab() {
  const { items } = useChecklistStore();

  return (
    <ContentContainer
      headerTitle="Checklist"
      hideBackButton
      style={{ paddingHorizontal: n(20) }}
    >
      <CustomScrollView
        data={items}
        renderItem={({ item }) => (
          <ChecklistItem id={item.id} text={item.text} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: n(28) }}
      />
    </ContentContainer>
  );
}
