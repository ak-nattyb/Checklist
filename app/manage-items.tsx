import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";

export default function ManageItemsScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id)
  );
  const allItems = useChecklistStore((state) => state.items);
  const moveItemWithinList = useChecklistStore(
    (state) => state.moveItemWithinList
  );
  const { invertColors } = useInvertColors();
  const [hasScrollIndicator, setHasScrollIndicator] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const items = allItems.filter((candidate) => candidate.listId === id);
  const iconColor = invertColors ? "black" : "white";
  const disabledColor = invertColors ? "#C1C1C1" : "#6E6E6E";

  useFocusEffect(
    useCallback(() => {
      setSelectedItemIds([]);
    }, [])
  );

  const toggleSelection = (itemId: string) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((currentId) => currentId !== itemId)
        : [...currentIds, itemId]
    );
  };

  const handleDeletePress = () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    router.push({
      pathname: "/delete-items",
      params: {
        itemIds: selectedItemIds.join(","),
        listId: id,
      },
    } as never);
  };

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Manage Items">
        <StyledText style={styles.emptyText}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      contentGap={16}
      contentWidth="wide"
      headerTitle="Manage Items"
      onScrollIndicatorVisibilityChange={setHasScrollIndicator}
      reserveScrollGutter={false}
      rightAction={{
        icon: "delete-outline",
        onPress: handleDeletePress,
        show: selectedItemIds.length > 0,
      }}
      scrollable={items.length > 0}
      style={items.length === 0 ? styles.emptyContainer : undefined}
    >
      {items.length === 0 ? (
        <StyledText style={styles.emptyText}>No items yet.</StyledText>
      ) : (
        items.map((item, index) => {
          const isSelected = selectedItemIds.includes(item.id);
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <View key={item.id} style={styles.itemRow}>
              <HapticPressable
                onPress={() => toggleSelection(item.id)}
                style={styles.iconButton}
              >
                <MaterialIcons
                  color={iconColor}
                  name={
                    isSelected
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  size={n(28)}
                />
              </HapticPressable>
              <HapticPressable
                onPress={() => toggleSelection(item.id)}
                style={styles.textContainer}
              >
                <StyledText numberOfLines={1} style={styles.text}>
                  {item.text}
                </StyledText>
              </HapticPressable>
              <View
                style={[
                  styles.actions,
                  { paddingRight: n(hasScrollIndicator ? 16 : 0) },
                ]}
              >
                <HapticPressable
                  disabled={isFirst}
                  onPress={() => moveItemWithinList(item.id, "up")}
                  style={styles.arrowButton}
                >
                  <MaterialIcons
                    color={isFirst ? disabledColor : iconColor}
                    name="keyboard-arrow-up"
                    size={n(28)}
                  />
                </HapticPressable>
                <HapticPressable
                  disabled={isLast}
                  onPress={() => moveItemWithinList(item.id, "down")}
                  style={styles.arrowButton}
                >
                  <MaterialIcons
                    color={isLast ? disabledColor : iconColor}
                    name="keyboard-arrow-down"
                    size={n(28)}
                  />
                </HapticPressable>
              </View>
            </View>
          );
        })
      )}
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
  },
  arrowButton: {
    alignItems: "center",
    height: n(32),
    justifyContent: "center",
    width: n(32),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: n(18),
    textAlign: "center",
  },
  iconButton: {
    alignItems: "center",
    height: n(28),
    justifyContent: "center",
    width: n(28),
  },
  itemRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: n(14),
    width: "100%",
  },
  text: {
    fontSize: n(24),
    includeFontPadding: false,
    lineHeight: n(28),
  },
  textContainer: {
    flex: 1,
  },
});
