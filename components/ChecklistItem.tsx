import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";

interface ButtonProps {
  text: string;
  onPress?: () => void;
  onDelete?: () => void; // Add this
  strikethrough?: boolean;
}

export function ChecklistItem({
  text,
  onPress,
  onDelete,
  strikethrough = false,
}: ButtonProps) {
  const [isStruckthrough, setIsStruckthrough] = useState(strikethrough);

  function flipUnderline() {
    setIsStruckthrough((prev) => !prev); // Tell React the value changed → triggers re-render
  }

  return (
    <HapticPressable
      style={styles.button}
      onPress={flipUnderline}
      onLongPress={onDelete}
    >
      <StyledText
        style={[styles.buttonText, isStruckthrough && styles.strikethrough]}
        numberOfLines={1}
      >
        {text}
      </StyledText>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  buttonText: {
    fontSize: n(30),
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});
