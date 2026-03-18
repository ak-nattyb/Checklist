import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface ButtonProps {
  id: string;
  text: string;
  onPress?: () => void;
  onDelete?: () => void;
  strikethrough?: boolean;
}

export function ChecklistItem({
  text,
  onPress,
  onDelete,
  strikethrough = false,
  id,
}: ButtonProps) {
  const [isStruckthrough, setIsStruckthrough] = useState(strikethrough);

  function flipUnderline() {
    setIsStruckthrough((prev) => !prev); // Tell React the value changed → triggers re-render
  }

  return (
    <HapticPressable
      style={styles.button}
      onPress={flipUnderline}
      onLongPress={() => router.push(`/confirm?id=${id}`)}
    >
      <MaterialIcons
        name={isStruckthrough ? "check-box" : "check-box-outline-blank"}
        size={n(35)}
        color={"white"}
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
