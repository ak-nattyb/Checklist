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
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

export default function MoveItemScreen() {
  const { id = "", selectedListId } = useLocalSearchParams<{
    id?: string;
    selectedListId?: string;
  }>();
  const item = useChecklistStore((state) =>
    state.items.find((candidate) => candidate.id === id)
  );
  const lists = useChecklistStore((state) => state.lists);
  const moveItem = useChecklistStore((state) => state.moveItem);
  const { invertColors } = useInvertColors();
  const [selectedId, setSelectedId] = useState(item?.listId ?? "");
  const textColor = invertColors ? "black" : "white";
  const canMove = Boolean(item && selectedId && selectedId !== item.listId);

  useEffect(() => {
    setSelectedId(selectedListId ?? item?.listId ?? "");
  }, [item, selectedListId]);

  const handleDone = usePreventDoubleTap(() => {
    if (!(item && canMove)) {
      return;
    }

    moveItem(item.id, selectedId);
    router.dismissTo(getListHref(selectedId));
  });

  const handleCreateList = usePreventDoubleTap(() => {
    router.push({
      pathname: "/create-list",
      params: {
        itemId: id,
        returnTo: "move-item",
      },
    } as never);
  });

  const renderListItem = (list: ChecklistList) => {
    const isSelected = selectedId === list.id;

    return (
      <HapticPressable
        key={list.id}
        onPress={() => setSelectedId(list.id)}
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
              list.id === INBOX_LIST_ID
                ? INBOX_ICON
                : getSafeListIconName(list.iconName)
            }
            size={n(24)}
          />
        </View>
        <View style={styles.textContainer}>
          <StyledText numberOfLines={1} style={styles.listName}>
            {list.name}
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

  if (!item) {
    return (
      <ContentContainer contentGap={20} headerTitle="Move Item">
        <StyledText style={styles.emptyText}>Item not found.</StyledText>
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
            disabled={!canMove}
            onPress={handleDone}
            style={[styles.doneButton, !canMove && styles.disabledButton]}
          >
            <StyledText style={styles.doneButtonText}>Done</StyledText>
          </HapticPressable>
        </View>
      }
      headerTitle="Move Item"
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
      {lists.map(renderListItem)}
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
    marginRight: n(15),
  },
});
