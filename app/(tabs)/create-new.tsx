import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { n } from "@/utils/scaling";
import { router } from "expo-router";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";

export default function CreateNew() {
  return (
    <ContentContainer headerTitle="Choose Item" style={styles.container}>
      <HapticPressable
        onPress={() =>
          router.push(
            `/create-new-type?itemType=item&location=${
              useChecklistStore.getState().activeFolderId
                ? useChecklistStore
                    .getState()
                    .getEntryName(useChecklistStore.getState().activeFolderId)
                : ""
            }`,
          )
        }
      >
        <StyledText style={styles.text}>{"Add New Item"}</StyledText>
      </HapticPressable>
      <HapticPressable
        onPress={() =>
          router.push(
            `/create-new-type?itemType=recurringitem&location=${
              useChecklistStore.getState().activeFolderId
                ? useChecklistStore
                    .getState()
                    .getEntryName(useChecklistStore.getState().activeFolderId)
                : ""
            }&recurring=""`,
          )
        }
      >
        <StyledText style={styles.text}>{"Add Recurring Item"}</StyledText>
      </HapticPressable>
      <HapticPressable
        onPress={() =>
          router.push(
            `/create-new-type?itemType=folder&location=${
              useChecklistStore.getState().activeFolderId
                ? useChecklistStore
                    .getState()
                    .getEntryName(useChecklistStore.getState().activeFolderId)
                : ""
            }`,
          )
        }
      >
        <StyledText style={styles.text}>{"Add New Folder"}</StyledText>
      </HapticPressable>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: n(32),
    paddingBottom: n(20),
  },
  text: {
    fontSize: n(30),
  },
});
