import React from "react";
import { StyleSheet, View } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

interface ButtonProps {
  id: string;
  text: string;
  location: string;
  onPress: () => void;
}

export function ChecklistFolder({ text, id, location, onPress }: ButtonProps) {
  const { invertColors } = useInvertColors();
  const { displayMode } = useDisplayMode();

  return (
    <View
      style={
        displayMode === "Lg"
          ? LgStyles.primaryContainer //100%
          : displayMode === "Md"
            ? MdStyles.primaryContainer //75%
            : SmStyles.primaryContainer //50%
      }
    >
      <HapticPressable
        onPress={onPress}
        onLongPress={() => router.push(`/delete-item?id=${id}`)}
      >
        <MaterialIcons
          name={"folder"}
          size={
            displayMode === "Lg"
              ? n(36) //100%
              : displayMode === "Md"
                ? n(28) //80%
                : n(21) //60%
          }
          color={invertColors ? "black" : "white"}
        />
      </HapticPressable>
      <HapticPressable
        onPress={() => router.push(`/edit-title?id=${id}`)}
        onLongPress={() => router.push(`/delete-item?id=${id}`)}
        style={
          displayMode === "Lg"
            ? LgStyles.textContainer
            : displayMode === "Md"
              ? MdStyles.textContainer
              : SmStyles.textContainer
        }
      >
        <StyledText
          style={
            displayMode === "Lg"
              ? LgStyles.text
              : displayMode === "Md"
                ? MdStyles.text
                : SmStyles.text
          }
          onPress={() => router.push(`/edit-title?id=${id}`)}
          onLongPress={() => router.push(`/delete-item?id=${id}`)}
        >
          {text}
        </StyledText>
      </HapticPressable>
    </View>
  );
}

const LgStyles = StyleSheet.create({
  primaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  textContainer: {
    flexShrink: 1,
  },
  text: {
    fontSize: n(30),
  },
});

const MdStyles = StyleSheet.create({
  primaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  textContainer: {
    flexShrink: 1,
  },
  text: {
    fontSize: n(24),
  },
});

const SmStyles = StyleSheet.create({
  primaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 6,
  },
  textContainer: {
    flexShrink: 1,
  },
  text: {
    fontSize: n(18),
  },
});
