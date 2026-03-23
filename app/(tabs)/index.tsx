import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

export default function Tab() {
  const { items } = useChecklistStore();
  const { displayMode } = useDisplayMode();

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
        contentContainerStyle={
          displayMode === "Lg"
            ? { gap: n(28) } //100%
            : displayMode === "Md"
              ? { gap: n(21) } //75%
              : { gap: n(14) } //50%
        }
      />
    </ContentContainer>
  );
}
