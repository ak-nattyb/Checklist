import { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { n } from "@/utils/scaling";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

export default function CreateNew() {
  const [query, setQuery] = useState("");
  const { itemType } = useLocalSearchParams<{ itemType: string }>();

  useFocusEffect(
    useCallback(() => {
      setQuery("");
    }, []),
  );

  const addItem = () => {
    if (query.length === 0) return;

    //check between a folder or an item
    if (itemType === "folder") {
      useChecklistStore.getState().addFolder(query);
    } else if (itemType === "item") {
      useChecklistStore.getState().addItem(query);
    }
    router.back();
  };

  return (
    <ContentContainer
      headerTitle={
        itemType === "item" ? "Create New Item" : "Create New Folder"
      }
      rightIcon="save"
      showRightIcon={query.length > 0}
      onRightIconPress={addItem}
      style={styles.container}
    >
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={itemType === "item" ? "Item Name" : "Folder Name"}
        onSubmit={addItem}
        autoFocus
      />
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: n(32),
    paddingBottom: n(20),
  },
});
