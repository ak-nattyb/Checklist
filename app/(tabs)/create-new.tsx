import { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { n } from "@/utils/scaling";
import { useChecklistStore } from "@/contexts/Checklist";
import { router, useFocusEffect } from "expo-router";

export default function CreateNew() {
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      setQuery("");
    }, []),
  );

  const addItem = () => {
    if (query.length === 0) return;
    useChecklistStore.getState().addItem(query);
    router.back();
  };

  return (
    <ContentContainer
      headerTitle="Create New Item"
      hideBackButton
      rightIcon="save"
      showRightIcon={query.length > 0}
      onRightIconPress={addItem}
      style={styles.container}
    >
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder="Add New Item"
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
