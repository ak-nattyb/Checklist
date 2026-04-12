import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { HapticPressable } from "./HapticPressable";
import { StyledText } from "./StyledText";

interface ReorderItemProps {
  actionsInset?: number;
  isFirst?: boolean;
  isLast?: boolean;
  label: string;
  onMoveDown: () => void;
  onMoveUp: () => void;
}

export function ReorderItem({
  actionsInset = 0,
  isFirst = false,
  isLast = false,
  label,
  onMoveDown,
  onMoveUp,
}: ReorderItemProps) {
  const { invertColors } = useInvertColors();
  const iconColor = invertColors ? "black" : "white";
  const disabledColor = invertColors ? "#C1C1C1" : "#6E6E6E";

  return (
    <View style={styles.container}>
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
  label: {
    fontSize: n(22),
    lineHeight: n(24),
  },
  textContainer: {
    flex: 1,
    marginRight: n(15),
  },
});
