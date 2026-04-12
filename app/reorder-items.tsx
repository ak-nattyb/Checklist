import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { ReorderItem } from "@/components/ReorderItem";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { n } from "@/utils/scaling";

export default function ReorderItemsScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id)
  );
  const allItems = useChecklistStore((state) => state.items);
  const moveItemWithinList = useChecklistStore(
    (state) => state.moveItemWithinList
  );
  const items = allItems.filter((candidate) => candidate.listId === id);
  const [hasScrollIndicator, setHasScrollIndicator] = useState(false);

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Reorder Items">
        <StyledText style={{ fontSize: n(18) }}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      contentGap={8}
      headerTitle="Reorder Items"
      onScrollIndicatorVisibilityChange={setHasScrollIndicator}
      reserveScrollGutter={false}
      scrollable={items.length > 0}
      style={
        items.length === 0
          ? { alignItems: "center", justifyContent: "center" }
          : undefined
      }
    >
      {items.length === 0 ? (
        <StyledText style={{ fontSize: n(18) }}>No items yet.</StyledText>
      ) : (
        items.map((item, index) => (
          <ReorderItem
            actionsInset={hasScrollIndicator ? 16 : 0}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            key={item.id}
            label={item.text}
            onMoveDown={() => moveItemWithinList(item.id, "down")}
            onMoveUp={() => moveItemWithinList(item.id, "up")}
          />
        ))
      )}
    </ContentContainer>
  );
}
