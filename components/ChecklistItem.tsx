import React from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";

interface ButtonProps {
  id: string;
  text: string;
  checked?: boolean;
}

export function ChecklistItem({ text, id }: ButtonProps) {
  const { invertColors } = useInvertColors();
  const isChecked = useChecklistStore(
    (state) => state.items.find((item) => item.id === id)?.isChecked ?? false,
  );

  function flipUnderline() {
    useChecklistStore.getState().modifyItem(id);
  }

  return (
    <HapticPressable
      style={styles.button}
      onPress={flipUnderline}
      onLongPress={() => router.push(`/confirm?id=${id}`)}
    >
      <MaterialIcons
        name={isChecked ? "check-box" : "check-box-outline-blank"}
        size={n(35)}
        color={invertColors ? "black" : "white"}
      />
      <StyledText style={styles.buttonText} numberOfLines={1}>
        {text}
      </StyledText>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
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
