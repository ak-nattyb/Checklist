import { useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { ReorderListItem } from "@/components/ReorderListItem";
import { StyledText } from "@/components/StyledText";
import { getSafeListIconName, INBOX_ICON } from "@/constants/listIcons";
import { INBOX_LIST_ID, useChecklistStore } from "@/contexts/ChecklistContext";
import { n } from "@/utils/scaling";

export default function ReorderListsScreen() {
  const lists = useChecklistStore((state) => state.lists);
  const moveList = useChecklistStore((state) => state.moveList);
  const [hasScrollIndicator, setHasScrollIndicator] = useState(false);

  if (lists.length === 0) {
    return (
      <ContentContainer contentGap={20} headerTitle="Reorder Lists">
        <StyledText style={{ fontSize: n(18) }}>No lists yet.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      contentGap={8}
      contentWidth="wide"
      headerTitle="Reorder Lists"
      onScrollIndicatorVisibilityChange={setHasScrollIndicator}
      reserveScrollGutter={false}
    >
      {lists.map((list, index) => (
        <ReorderListItem
          actionsInset={hasScrollIndicator ? 16 : 0}
          iconName={
            list.id === INBOX_LIST_ID
              ? INBOX_ICON
              : getSafeListIconName(list.iconName)
          }
          isFirst={index <= 1}
          isLast={index === 0 || index === lists.length - 1}
          key={list.id}
          label={list.name}
          onMoveDown={() => moveList(list.id, "down")}
          onMoveUp={() => moveList(list.id, "up")}
        />
      ))}
    </ContentContainer>
  );
}
