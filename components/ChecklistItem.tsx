import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useItemNameTap } from "@/contexts/ItemNameTapContext";
import { n } from "@/utils/scaling";
import { HapticPressable } from "./HapticPressable";
import { StyledText } from "./StyledText";

interface ChecklistItemProps {
  id: string;
  text: string;
}

export function ChecklistItem({ id, text }: ChecklistItemProps) {
  const { invertColors } = useInvertColors();
  const { itemNameTapAction } = useItemNameTap();
  const isChecked = useChecklistStore(
    (state) => state.items.find((item) => item.id === id)?.isChecked ?? false
  );
  const toggleItem = useChecklistStore((state) => state.toggleItem);
  const iconColor = invertColors ? "black" : "white";
  const openItemActions = () =>
    router.push({
      pathname: "/item-actions",
      params: { id },
    } as never);
  const handleNamePress = () => {
    if (itemNameTapAction === "rename") {
      router.push({
        pathname: "/edit-title",
        params: { id, type: "item" },
      } as never);
      return;
    }

    toggleItem(id);
  };

  return (
    <View style={[styles.container, isChecked && styles.checkedContainer]}>
      <HapticPressable
        onLongPress={openItemActions}
        onPress={() => toggleItem(id)}
        style={styles.iconButton}
      >
        <MaterialIcons
          color={iconColor}
          name={isChecked ? "check-box" : "check-box-outline-blank"}
          size={n(28)}
        />
      </HapticPressable>
      <HapticPressable
        onLongPress={openItemActions}
        onPress={handleNamePress}
        style={styles.textContainer}
      >
        <StyledText style={[styles.text, isChecked && styles.checkedText]}>
          {text}
        </StyledText>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  checkedContainer: {
    opacity: 0.5,
  },
  checkedText: {
    textDecorationLine: "line-through",
  },
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: n(14),
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
    height: n(28),
    justifyContent: "center",
    width: n(28),
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
