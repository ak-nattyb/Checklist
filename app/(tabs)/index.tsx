import { router } from "expo-router";
import { ChecklistList } from "@/components/ChecklistList";
import ContentContainer from "@/components/ContentContainer";
import { StyledText } from "@/components/StyledText";
import { getSafeListIconName, INBOX_ICON } from "@/constants/listIcons";
import { INBOX_LIST_ID, useChecklistStore } from "@/contexts/ChecklistContext";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

export default function ListsScreen() {
  const lists = useChecklistStore((state) => state.lists);

  return (
    <ContentContainer
      contentGap={8}
      contentWidth="wide"
      headerTitle="Checklist"
      hideBackButton
      key="lists-root"
      leftAction={{
        icon: "swap-vert",
        onPress: () => router.push("/reorder-lists"),
      }}
      rightAction={{
        icon: "add",
        onPress: () => router.push("/create-list"),
      }}
    >
      {lists.length === 0 ? (
        <StyledText style={{ fontSize: n(18) }}>No lists yet.</StyledText>
      ) : (
        lists.map((item) => (
          <ChecklistList
            iconName={
              item.id === INBOX_LIST_ID
                ? INBOX_ICON
                : getSafeListIconName(item.iconName)
            }
            key={item.id}
            onLongPress={() =>
              router.push({
                pathname: "/list-actions",
                params: { id: item.id },
              })
            }
            onOpen={() => router.push(getListHref(item.id))}
            text={item.name}
          />
        ))
      )}
    </ContentContainer>
  );
}
