import { useState } from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { n } from "@/utils/scaling";

export default function CreateNew() {
  const [query, setQuery] = useState("");

  const addItem = () => {};

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
