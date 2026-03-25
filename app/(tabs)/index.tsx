import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

export default function Tab() {
  const { entries } = useChecklistStore();
  const { displayMode } = useDisplayMode();

  return (
    <ContentContainer
      headerTitle="Checklist"
      hideBackButton
      style={{ paddingHorizontal: n(20) }}
    >
      <CustomScrollView
        data={entries}
        renderItem={({ item }) => (
          <ChecklistItem
            id={item.id}
            text={item.text}
            location={item.location}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          displayMode === "Lg"
            ? { gap: n(25) } //100%
            : displayMode === "Md"
              ? { gap: n(20) } //80%
              : { gap: n(15) } //60%
        }
      />
    </ContentContainer>
  );
}
