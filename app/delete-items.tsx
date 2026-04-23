import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { usePreventDoubleTap } from "@/hooks/usePreventDoubleTap";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

const getParamValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

const getItemIds = (value: string | string[] | undefined) => {
  const rawValue = getParamValue(value);
  return [
    ...new Set(rawValue.split(",").map((itemId) => itemId.trim())),
  ].filter(Boolean);
};

export default function DeleteItemsScreen() {
  const params = useLocalSearchParams<{
    itemIds?: string | string[];
    listId?: string | string[];
  }>();
  const listId = useMemo(() => getParamValue(params.listId), [params.listId]);
  const requestedItemIds = useMemo(
    () => getItemIds(params.itemIds),
    [params.itemIds]
  );
  const allItems = useChecklistStore((state) => state.items);
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === listId)
  );
  const selectedItems = useMemo(
    () =>
      allItems.filter(
        (item) => item.listId === listId && requestedItemIds.includes(item.id)
      ),
    [allItems, listId, requestedItemIds]
  );
  const deleteItems = useChecklistStore((state) => state.deleteItems);
  const { invertColors } = useInvertColors();
  const [isDeleting, setIsDeleting] = useState(false);
  const textColor = invertColors ? "black" : "white";

  const handleDelete = usePreventDoubleTap(() => {
    setIsDeleting(true);

    if (selectedItems.length > 0) {
      deleteItems(selectedItems.map((item) => item.id));
    }

    if (list) {
      router.dismissTo(getListHref(listId));
      return;
    }

    router.dismissTo("/(tabs)");
  });

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Delete Items">
        <StyledText style={styles.messageText}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  if (isDeleting) {
    return null;
  }

  if (selectedItems.length === 0) {
    return (
      <ContentContainer contentGap={20} headerTitle="Delete Items">
        <StyledText style={styles.messageText}>No items selected.</StyledText>
      </ContentContainer>
    );
  }

  const itemCount = selectedItems.length;
  const message =
    itemCount === 1
      ? `Are you sure you want to delete 1 item from ${list.name}?`
      : `Are you sure you want to delete ${itemCount} items from ${list.name}?`;

  return (
    <ContentContainer
      contentGap={20}
      footer={
        <HapticPressable onPress={handleDelete} style={styles.button}>
          <StyledText style={[styles.buttonText, { color: textColor }]}>
            DELETE
          </StyledText>
        </HapticPressable>
      }
      headerTitle="Delete Items"
    >
      <StyledText style={styles.messageText}>{message}</StyledText>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    minWidth: n(200),
    width: "100%",
  },
  buttonText: {
    fontSize: n(40),
    textAlign: "center",
    textTransform: "uppercase",
  },
  messageText: {
    fontSize: n(18),
  },
});
