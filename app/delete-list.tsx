import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { isInboxList, useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";

export default function DeleteListScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id)
  );
  const itemCount = useChecklistStore(
    (state) => state.items.filter((item) => item.listId === id).length
  );
  const deleteList = useChecklistStore((state) => state.deleteList);
  const { invertColors } = useInvertColors();
  const textColor = invertColors ? "black" : "white";

  useEffect(() => {
    if (isInboxList(id)) {
      router.dismissTo("/(tabs)");
    }
  }, [id]);

  const handleDelete = () => {
    if (id && !isInboxList(id)) {
      deleteList(id);
    }
    router.dismissTo("/(tabs)");
  };

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Delete List">
        <StyledText style={styles.messageText}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  if (isInboxList(id)) {
    return null;
  }

  const itemLabel = itemCount === 1 ? "item" : "items";

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
      headerTitle="Delete List"
    >
      <StyledText style={styles.messageText}>
        {`Are you sure you want to delete ${list.name} and all of its ${itemCount} ${itemLabel}?`}
      </StyledText>
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
