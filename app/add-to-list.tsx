import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { getSafeListIconName, INBOX_ICON } from "@/constants/listIcons";
import {
  type ChecklistList,
  INBOX_LIST_ID,
  useChecklistStore,
} from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { usePreventDoubleTap } from "@/hooks/usePreventDoubleTap";
import { n } from "@/utils/scaling";

export default function AddToListScreen() {
  const { itemName, selectedListId } = useLocalSearchParams<{
    itemName?: string;
    selectedListId?: string;
  }>();
  const lists = useChecklistStore((state) => state.lists);
  const addItem = useChecklistStore((state) => state.addItem);
  const { invertColors } = useInvertColors();
  const [selectedId, setSelectedId] = useState(selectedListId ?? "");

  useEffect(() => {
    setSelectedId(selectedListId ?? "");
  }, [selectedListId]);

  const itemText = itemName?.trim() ?? "";
  const textColor = invertColors ? "black" : "white";
  const canAdd = itemText.length > 0 && selectedId.length > 0;

  const handleDone = usePreventDoubleTap(() => {
    if (!canAdd) {
      return;
    }

    addItem(itemText, selectedId);
    router.dismissTo({
      pathname: "/",
      params: {
        resetToken: `${Date.now()}`,
      },
    });
  });

  const handleCreateList = usePreventDoubleTap(() => {
    router.push({
      pathname: "/create-list",
      params: {
        itemName: itemText,
        returnTo: "add-to-list",
        selectedListId: selectedId,
      },
    });
  });

  const renderListItem = (item: ChecklistList) => {
    const isSelected = selectedId === item.id;

    return (
      <HapticPressable
        key={item.id}
        onPress={() => setSelectedId(isSelected ? "" : item.id)}
        style={styles.listItem}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: invertColors ? "black" : "#282828" },
          ]}
        >
          <MaterialIcons
            color="white"
            name={
              item.id === INBOX_LIST_ID
                ? INBOX_ICON
                : getSafeListIconName(item.iconName)
            }
            size={n(24)}
          />
        </View>
        <View style={styles.textContainer}>
          <StyledText numberOfLines={1} style={styles.listName}>
            {item.name}
          </StyledText>
        </View>
        <MaterialIcons
          color={textColor}
          name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
          size={n(24)}
        />
      </HapticPressable>
    );
  };

  if (!itemText) {
    return (
      <ContentContainer headerTitle="Add to List">
        <StyledText style={styles.emptyText}>No item to add.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      bottomPadding={0}
      contentGap={8}
      contentWidth="wide"
      footer={
        <View style={styles.doneContainer}>
          <HapticPressable
            disabled={!canAdd}
            onPress={handleDone}
            style={[styles.doneButton, !canAdd && styles.disabledButton]}
          >
            <StyledText style={styles.doneButtonText}>Done</StyledText>
          </HapticPressable>
        </View>
      }
      headerTitle="Add to List"
    >
      <HapticPressable onPress={handleCreateList} style={styles.createListItem}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: invertColors ? "black" : "#282828" },
          ]}
        >
          <MaterialIcons color="white" name="add" size={n(24)} />
        </View>
        <View style={styles.textContainer}>
          <StyledText style={styles.listName}>Create new list</StyledText>
        </View>
      </HapticPressable>

      {lists.length === 0 ? (
        <StyledText style={styles.emptyText}>
          Create a list to add this item.
        </StyledText>
      ) : (
        lists.map(renderListItem)
      )}
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  createListItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: n(50),
  },
  disabledButton: {
    opacity: 0.35,
  },
  doneButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: n(200),
    paddingVertical: n(15),
  },
  doneButtonText: {
    fontSize: n(40),
    textTransform: "uppercase",
  },
  doneContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  emptyText: {
    fontSize: n(18),
    textAlign: "center",
  },
  iconBox: {
    alignItems: "center",
    height: n(50),
    justifyContent: "center",
    marginRight: n(15),
    width: n(50),
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: n(50),
  },
  listName: {
    fontSize: n(22),
    lineHeight: n(24),
  },
  textContainer: {
    flex: 1,
    gap: 0,
    marginRight: n(15),
  },
});
