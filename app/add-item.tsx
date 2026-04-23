import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { StyledText } from "@/components/StyledText";
import { TextInput } from "@/components/TextInput";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

export default function AddItemScreen() {
  const { listId = "" } = useLocalSearchParams<{ listId?: string }>();
  const list = useChecklistStore((state) =>
    state.lists.find((candidate) => candidate.id === listId)
  );
  const addItem = useChecklistStore((state) => state.addItem);
  const [itemName, setItemName] = useState("");

  useFocusEffect(
    useCallback(() => {
      setItemName("");
    }, [])
  );

  const handleSubmit = () => {
    const trimmedName = itemName.trim();
    if (!(list && trimmedName)) {
      return;
    }

    addItem(trimmedName, list.id);
    router.dismissTo(getListHref(list.id));
  };

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="Add Item">
        <StyledText style={{ fontSize: n(18) }}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      headerTitle="Add Item"
      rightAction={{
        icon: "check",
        onPress: handleSubmit,
        show: itemName.trim().length > 0,
      }}
    >
      <TextInput
        autoFocus
        onChangeText={setItemName}
        onSubmit={handleSubmit}
        placeholder="Item Name"
        value={itemName}
      />
    </ContentContainer>
  );
}
