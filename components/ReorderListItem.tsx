import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { HapticPressable } from "./HapticPressable";
import { StyledText } from "./StyledText";

interface ReorderListItemProps {
  actionsInset?: number;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isFirst?: boolean;
  isLast?: boolean;
  label: string;
  onMoveDown: () => void;
  onMoveUp: () => void;
}

export function ReorderListItem({
  actionsInset = 0,
  iconName,
  isFirst = false,
  isLast = false,
  label,
  onMoveDown,
  onMoveUp,
}: ReorderListItemProps) {
  const { invertColors } = useInvertColors();
  const iconColor = invertColors ? "black" : "white";
  const disabledColor = invertColors ? "#C1C1C1" : "#6E6E6E";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: invertColors ? "black" : "#282828" },
        ]}
      >
        <MaterialIcons color="white" name={iconName} size={n(24)} />
      </View>
      <View style={styles.textContainer}>
        <StyledText numberOfLines={1} style={styles.label}>
          {label}
        </StyledText>
      </View>
      <View style={[styles.actions, { paddingRight: n(actionsInset) }]}>
        <HapticPressable
          disabled={isFirst}
          onPress={onMoveUp}
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
          onPress={onMoveDown}
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
  container: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: n(50),
    width: "100%",
  },
  iconBox: {
    alignItems: "center",
    height: n(50),
    justifyContent: "center",
    marginRight: n(15),
    width: n(50),
  },
  label: {
    fontSize: n(22),
    lineHeight: n(24),
  },
  textContainer: {
    flex: 1,
    marginRight: n(15),
    paddingVertical: n(13),
  },
});
