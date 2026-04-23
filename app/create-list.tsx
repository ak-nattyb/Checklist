import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { TextInput } from "@/components/TextInput";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { usePreventDoubleTap } from "@/hooks/usePreventDoubleTap";
import { getListHref } from "@/utils/routes";

export default function CreateListScreen() {
  const { itemId, itemName, returnTo } = useLocalSearchParams<{
    itemId?: string;
    itemName?: string;
    returnTo?: string;
  }>();
  const addList = useChecklistStore((state) => state.addList);
  const [listName, setListName] = useState("");

  useFocusEffect(
    useCallback(() => {
      setListName("");
    }, [])
  );

  const handleSubmit = usePreventDoubleTap(() => {
    const trimmedName = listName.trim();
    if (!trimmedName) {
      return;
    }

    const id = addList(trimmedName);

    if (returnTo === "add-to-list" && itemName?.trim()) {
      router.navigate({
        pathname: "/add-to-list",
        params: {
          itemName: itemName.trim(),
          selectedListId: id,
        },
      });
      return;
    }

    if (returnTo === "move-item" && itemId) {
      router.navigate({
        pathname: "/move-item",
        params: {
          id: itemId,
          selectedListId: id,
        },
      });
      return;
    }

    router.dismissTo(getListHref(id));
  });

  return (
    <ContentContainer
      headerTitle="Create List"
      rightAction={{
        icon: "check",
        onPress: handleSubmit,
        show: listName.trim().length > 0,
      }}
    >
      <TextInput
        autoFocus
        onChangeText={setListName}
        onSubmit={handleSubmit}
        placeholder="List Name"
        value={listName}
      />
    </ContentContainer>
  );
}
