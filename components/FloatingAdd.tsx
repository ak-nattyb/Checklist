import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { HapticPressable } from "./HapticPressable";

export function Navbar() {
  const { invertColors } = useInvertColors();

  return (
    <View
      style={[
        styles.navbar,
        { backgroundColor: invertColors ? "white" : "black" },
      ]}
    ></View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: n(11),
    paddingHorizontal: n(20),
  },
});
