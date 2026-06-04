import { router, useLocalSearchParams } from "expo-router";
import { ChecklistItem } from "@/components/ChecklistItem";
import ContentContainer from "@/components/ContentContainer";
import { StyledText } from "@/components/StyledText";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { n } from "@/utils/scaling";
import { View, StyleSheet } from "react-native";
import { FloatingAdd } from "@/components/FloatingAdd";
import { HapticPressable } from "@/components/HapticPressable";
import { MaterialIcons } from "@expo/vector-icons";
import { useInvertColors } from "@/contexts/InvertColorsContext";

export default function ListScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === id),
  );
  const allItems = useChecklistStore((state) => state.items);
  const items = allItems.filter((item) => item.listId === id);
  const { invertColors } = useInvertColors();

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="List">
        <StyledText style={{ fontSize: n(18) }}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <View style={styles.container}>
      <ContentContainer
        contentGap={16}
        contentWidth="wide"
        headerTitle={list.name}
        onTitlePress={() =>
          router.push({
            pathname: "/list-actions",
            params: { id },
          })
        }
        rightAction={{
          icon: "add",
          onPress: () =>
            router.push({
              pathname: "/add-item",
              params: { listId: id },
            } as never),
        }}
        scrollable={items.length > 0}
        style={
          items.length === 0
            ? { alignItems: "center", justifyContent: "center" }
            : undefined
        }
      >
        {items.length === 0 ? (
          <StyledText style={{ fontSize: n(18) }}>No items yet.</StyledText>
        ) : (
          items.map((item) => (
            <ChecklistItem id={item.id} key={item.id} text={item.text} />
          ))
        )}
      </ContentContainer>
      <HapticPressable
        style={styles.icon}
        onPress={() =>
          router.push({
            pathname: "/add-item",
            params: { listId: id },
          } as never)
        }
      >
        <MaterialIcons
          name="add"
          color={invertColors ? "#C1C1C1" : "#6E6E6E"}
          size={n(48)}
        />
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    gap: 0,
  },
  icon: {
    padding: n(11),
  },
});
