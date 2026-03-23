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
        displayMode === "Lg"
          ? LgStyles.button //100%
          : displayMode === "Md"
            ? MdStyles.button //75%
            : SmStyles.button //50%
      }
      onLongPress={() => router.push(`/confirm?id=${id}`)}
    >
      <MaterialIcons
        name={isChecked ? "check-box" : "check-box-outline-blank"}
        onPress={flipChecked}
        size={
          displayMode === "Lg"
            ? n(36) //100%
            : displayMode === "Md"
              ? n(28) //80%
              : n(21) //60%
        }
        color={invertColors ? "black" : "white"}
      />
      <StyledText
        style={
          displayMode === "Lg"
            ? LgStyles.buttonText
            : displayMode === "Md"
              ? MdStyles.buttonText
              : SmStyles.buttonText
        }
      >
        {text}
      </StyledText>
    </HapticPressable>
  );
}

const LgStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  buttonText: {
    fontSize: n(30),
    flexShrink: 1,
  },
});

const MdStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  buttonText: {
    fontSize: n(24),
    flexShrink: 1,
  },
});

const SmStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 6,
  },
  buttonText: {
    fontSize: n(18),
    flexShrink: 1,
  },
});
