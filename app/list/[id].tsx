import { router, useLocalSearchParams } from "expo-router";
import { ChecklistItem } from "@/components/ChecklistItem";
import ContentContainer from "@/components/ContentContainer";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { n } from "@/utils/scaling";

export default function ListScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id)
  );
  const allItems = useChecklistStore((state) => state.items);
  const items = allItems.filter((item) => item.listId === id);

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="List">
        <StyledText style={{ fontSize: n(18) }}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      contentGap={16}
      contentWidth="wide"
      headerTitle={list.name}
      onTitlePress={() =>
        router.push({
          pathname: "/list-actions",
          params: { id },
        })
      }
      rightAction={{
        icon: "playlist-add",
        onPress: () =>
          router.push({
            pathname: "/add-item",
            params: { listId: id },
          } as never),
      }}
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
        items.map((item) => (
          <ChecklistItem id={item.id} key={item.id} text={item.text} />
        ))
      )}
    </ContentContainer>
  );
}
