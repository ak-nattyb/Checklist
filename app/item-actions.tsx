import { setStringAsync } from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

export default function ItemActionsScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const item = useChecklistStore((state) =>
    state.items.find((candidate) => candidate.id === id)
  );
  const allItems = useChecklistStore((state) => state.items);
  const duplicateItem = useChecklistStore((state) => state.duplicateItem);
  const [copied, setCopied] = useState(false);
  const canMoveWithinList = item
    ? allItems.some(
        (candidate) =>
          candidate.listId === item.listId && candidate.id !== item.id
      )
    : false;

  if (!item) {
    return (
      <ContentContainer contentGap={20} headerTitle="Item Actions">
        <StyledText style={{ fontSize: n(18) }}>Item not found.</StyledText>
      </ContentContainer>
    );
  }

  const handleDuplicate = () => {
    const newItemId = duplicateItem(item.id);
    if (newItemId) {
      router.dismissTo(getListHref(item.listId));
    }
  };

  const handleCopy = async () => {
    await setStringAsync(item.text);
    setCopied(true);
  };

  return (
    <ContentContainer contentGap={20} headerTitle={item.text}>
      <StyledButton
        onPress={() =>
          router.push({
            pathname: "/edit-title",
            params: { id: item.id, type: "item" },
          })
        }
        text="Rename"
      />
      <StyledButton
        onPress={() =>
          router.push({
            pathname: "/delete-item",
            params: { id: item.id },
          } as never)
        }
        text="Delete"
      />
      <StyledButton onPress={handleDuplicate} text="Duplicate" />
      {canMoveWithinList && (
        <StyledButton
          onPress={() =>
            router.push({
              pathname: "/manage-items",
              params: { id: item.listId },
            } as never)
          }
          text="Move up/down"
        />
      )}
      <StyledButton
        onPress={() =>
          router.push({
            pathname: "/move-item",
            params: { id: item.id },
          } as never)
        }
        text="Move to list"
      />
      <StyledButton onPress={handleCopy} text={copied ? "Copied" : "Copy"} />
    </ContentContainer>
  );
}
