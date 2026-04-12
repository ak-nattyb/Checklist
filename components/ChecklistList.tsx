import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { HapticPressable } from "./HapticPressable";
import { StyledText } from "./StyledText";

interface ChecklistListProps {
  iconName?: keyof typeof MaterialIcons.glyphMap;
  isActive?: boolean;
  onIconLongPress?: () => void;
  onLongPress?: () => void;
  onOpen: () => void;
  text: string;
}

export function ChecklistList({
  iconName = "list",
  isActive = false,
  onIconLongPress,
  onLongPress,
  onOpen,
  text,
}: ChecklistListProps) {
  const { invertColors } = useInvertColors();

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <HapticPressable
        onLongPress={onIconLongPress ?? onLongPress}
        onPress={onIconLongPress ? undefined : onOpen}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: invertColors ? "black" : "#282828" },
          ]}
        >
          <MaterialIcons color="white" name={iconName} size={n(24)} />
        </View>
      </HapticPressable>
      <HapticPressable
        onLongPress={onLongPress}
        onPress={onOpen}
        style={styles.textContainer}
      >
        <StyledText style={styles.text}>{text}</StyledText>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activeContainer: {
    opacity: 0.8,
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
  text: {
    fontSize: n(22),
    lineHeight: n(24),
  },
  textContainer: {
    flex: 1,
  },
});
