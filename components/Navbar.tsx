import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { HapticPressable } from "./HapticPressable";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";
import { useChecklistStore } from "@/contexts/ChecklistContext";

export interface TabConfigItem {
  name: string;
  screenName: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

interface NavbarProps {
  tabsConfig?: readonly TabConfigItem[];
  currentScreenName: string;
  navigation: BottomTabBarProps["navigation"];
}

export function Navbar({
  tabsConfig,
  currentScreenName,
  navigation,
}: NavbarProps) {
  const { invertColors } = useInvertColors();

  return (
    <View
      style={[
        styles.navbar,
        { backgroundColor: invertColors ? "white" : "black" },
      ]}
    >
      {tabsConfig?.map((tab) => (
        <HapticPressable
          key={tab.screenName}
          onPress={() =>
            tab.screenName === "create-new"
              ? navigation.navigate(tab.screenName, {
                  itemType: "item",
                  location: useChecklistStore.getState().activeFolderId
                    ? useChecklistStore
                        .getState()
                        .getEntryName(
                          useChecklistStore.getState().activeFolderId,
                        )
                    : "",
                })
              : navigation.navigate(tab.screenName)
          }
          onLongPress={() =>
            tab.screenName === "create-new"
              ? navigation.navigate(tab.screenName, {
                  itemType: "folder",
                  location: useChecklistStore.getState().activeFolderId
                    ? useChecklistStore
                        .getState()
                        .getEntryName(
                          useChecklistStore.getState().activeFolderId,
                        )
                    : "",
                })
              : []
          }
        >
          <MaterialIcons
            name={tab.iconName}
            size={n(48)}
            color={
              tab.screenName === currentScreenName
                ? invertColors
                  ? "black"
                  : "white"
                : invertColors
                  ? "#C1C1C1"
                  : "#6E6E6E"
            }
          />
        </HapticPressable>
      ))}
    </View>
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
