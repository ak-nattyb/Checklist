import { useState } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { n } from "@/utils/scaling";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useLocalSearchParams, router } from "expo-router";

export default function EditTitle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [input, setInput] = useState(
    useChecklistStore.getState().getEntryName(id),
  );

  const renameItem = () => {
    if (input.length === 0) return;
    useChecklistStore.getState().renameEntry(id, input);
    router.back();
  };

  return (
    <ContentContainer
      headerTitle="Rename Entry"
      rightIcon="save"
      showRightIcon={input.length > 0}
      onRightIconPress={renameItem}
      style={styles.container}
    >
      <SearchInput
        value={input}
        onChangeText={setInput}
        placeholder=""
        onSubmit={renameItem}
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
