import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { StyledText } from "@/components/StyledText";
import { HapticPressable } from "@/components/HapticPressable";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { useChecklistStore } from "@/contexts/ChecklistContext";

export default function BulkDeleteCheckedItemsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  //single line function here
  const bulkDeleteItems = useChecklistStore(
    (state) => state.deleteCheckedItemsInFolder,
  );
  const router = useRouter();
  const { invertColors } = useInvertColors();

  function handleConfirm() {
    bulkDeleteItems(id);
    router.back();
  }
  function handleCancel() {
    router.back();
  }

  const textColor = invertColors ? "black" : "white";

  return (
    <ContentContainer headerTitle={"Delete Checked Items"}>
      <StyledText style={styles.messageText}>
        {`Are you sure you want to delete all checked items in ${
          useChecklistStore.getState().activeFolderId
            ? useChecklistStore
                .getState()
                .getEntryName(useChecklistStore.getState().activeFolderId)
            : "root folder"
        }?`}
      </StyledText>

      <View style={styles.buttonContainer}>
        <HapticPressable onPress={handleConfirm} style={styles.button}>
          <StyledText style={[styles.buttonText, { color: textColor }]}>
            {"yes"}
          </StyledText>
        </HapticPressable>
        <HapticPressable onPress={handleCancel} style={styles.button}>
          <StyledText style={[styles.buttonText, { color: textColor }]}>
            {"no"}
          </StyledText>
        </HapticPressable>
      </View>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: n(18),
    marginTop: n(10),
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    paddingVertical: n(15),
    paddingHorizontal: n(30),
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: n(200),
  },
  buttonText: {
    fontSize: n(30),
    textTransform: "uppercase",
  },
});
