import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

export default function DeleteItemScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const item = useChecklistStore((state) =>
    state.items.find((candidate) => candidate.id === id)
  );
  const deleteItem = useChecklistStore((state) => state.deleteItem);
  const { invertColors } = useInvertColors();
  const textColor = invertColors ? "black" : "white";

  const handleDelete = () => {
    if (item) {
      deleteItem(item.id);
      router.dismissTo(getListHref(item.listId));
      return;
    }

    router.dismissTo("/(tabs)");
  };

  if (!item) {
    return (
      <ContentContainer contentGap={20} headerTitle="Delete Item">
        <StyledText style={styles.messageText}>Item not found.</StyledText>
      </ContentContainer>
    );
  }

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
      headerTitle="Delete Item"
    >
      <StyledText style={styles.messageText}>
        {`Are you sure you want to delete ${item.text}?`}
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
