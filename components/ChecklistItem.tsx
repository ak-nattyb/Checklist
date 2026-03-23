import React from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

interface ButtonProps {
  id: string;
  text: string;
}

export function ChecklistItem({ text, id }: ButtonProps) {
  const { invertColors } = useInvertColors();
  const { displayMode } = useDisplayMode();
  const isChecked = useChecklistStore(
    (state) => state.items.find((item) => item.id === id)?.isChecked ?? false,
  );

  function flipChecked() {
    useChecklistStore.getState().modifyItem(id);
  }

  return (
    <HapticPressable
      style={
        displayMode === "comfortable"
          ? comfortableStyles.button //100%
          : displayMode === "standard"
            ? standardStyles.button //75%
            : compactStyles.button //50%
      }
      onPress={flipChecked}
      onLongPress={() => router.push(`/confirm?id=${id}`)}
    >
      <MaterialIcons
        name={isChecked ? "check-box" : "check-box-outline-blank"}
        size={
          displayMode === "comfortable"
            ? n(35) //100%
            : displayMode === "standard"
              ? n(27) //75%
              : n(18) //50%
        }
        color={invertColors ? "black" : "white"}
      />
      <StyledText
        style={
          displayMode === "comfortable"
            ? comfortableStyles.buttonText
            : displayMode === "standard"
              ? standardStyles.buttonText
              : compactStyles.buttonText
        }
        numberOfLines={1}
      >
        {text}
      </StyledText>
    </HapticPressable>
  );
}

const comfortableStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: n(30),
  },
});

const standardStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: n(23),
  },
});

const compactStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    fontSize: n(15),
  },
});
