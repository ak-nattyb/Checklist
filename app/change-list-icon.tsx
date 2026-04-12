import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { HapticPressable } from "@/components/HapticPressable";
import { StyledText } from "@/components/StyledText";
import {
  DEFAULT_LIST_ICON,
  getSafeListIconName,
  LIST_ICON_OPTIONS,
  type ListIconName,
  type ListIconOption,
} from "@/constants/listIcons";
import { isInboxList, useChecklistStore } from "@/contexts/ChecklistContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { usePreventDoubleTap } from "@/hooks/usePreventDoubleTap";
import { n } from "@/utils/scaling";

const goBackOrHome = () => {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace("/(tabs)");
};

export default function ChangeListIconScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id)
  );
  const changeListIcon = useChecklistStore((state) => state.changeListIcon);
  const { invertColors } = useInvertColors();
  const [selectedIconName, setSelectedIconName] =
    useState<ListIconName>(DEFAULT_LIST_ICON);
  const currentIconName = list
    ? getSafeListIconName(list.iconName)
    : DEFAULT_LIST_ICON;
  const canSave = selectedIconName !== currentIconName;
  const textColor = invertColors ? "black" : "white";

  useEffect(() => {
    if (isInboxList(id)) {
      goBackOrHome();
    }
  }, [id]);

  useEffect(() => {
    if (list) {
      setSelectedIconName(getSafeListIconName(list.iconName));
    }
  }, [list]);

  const handleDone = usePreventDoubleTap(() => {
    if (!(list && canSave)) {
      return;
    }

    changeListIcon(list.id, selectedIconName);
    goBackOrHome();
  });

  const renderIconOption = (option: ListIconOption) => {
    const isSelected = selectedIconName === option.name;

    return (
      <HapticPressable
        key={option.name}
        onPress={() => setSelectedIconName(option.name)}
        style={styles.iconItem}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: invertColors ? "black" : "#282828" },
          ]}
        >
          <MaterialIcons color="white" name={option.name} size={n(24)} />
        </View>
        <View style={styles.textContainer}>
          <StyledText numberOfLines={1} style={styles.iconName}>
            {option.label}
          </StyledText>
        </View>
        <MaterialIcons
          color={textColor}
          name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
          size={n(24)}
        />
      </HapticPressable>
    );
  };

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Change Icon">
        <StyledText style={styles.emptyText}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  if (isInboxList(id)) {
    return null;
  }

  return (
    <ContentContainer
      bottomPadding={0}
      contentGap={8}
      contentWidth="wide"
      footer={
        <View style={styles.doneContainer}>
          <HapticPressable
            disabled={!canSave}
            onPress={handleDone}
            style={[styles.doneButton, !canSave && styles.disabledButton]}
          >
            <StyledText style={styles.doneButtonText}>Done</StyledText>
          </HapticPressable>
        </View>
      }
      headerTitle="Change Icon"
    >
      {LIST_ICON_OPTIONS.map(renderIconOption)}
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.35,
  },
  doneButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: n(200),
    paddingVertical: n(15),
  },
  doneButtonText: {
    fontSize: n(40),
    textTransform: "uppercase",
  },
  doneContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  emptyText: {
    fontSize: n(18),
    textAlign: "center",
  },
  iconBox: {
    alignItems: "center",
    height: n(50),
    justifyContent: "center",
    marginRight: n(15),
    width: n(50),
  },
  iconItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: n(50),
  },
  iconName: {
    fontSize: n(22),
    lineHeight: n(24),
  },
  textContainer: {
    flex: 1,
    marginRight: n(15),
  },
});
