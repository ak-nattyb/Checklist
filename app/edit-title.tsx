import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { TextInput } from "@/components/TextInput";
import { isInboxList, useChecklistStore } from "@/contexts/ChecklistContext";

type RenameType = "item" | "list";

export default function EditTitleScreen() {
  const { id = "", type = "item" } = useLocalSearchParams<{
    id?: string;
    type?: RenameType;
  }>();
  const items = useChecklistStore((state) => state.items);
  const getListName = useChecklistStore((state) => state.getListName);
  const renameItem = useChecklistStore((state) => state.renameItem);
  const renameList = useChecklistStore((state) => state.renameList);
  const currentName =
    type === "list"
      ? getListName(id)
      : (items.find((item) => item.id === id)?.text ?? "");
  const [input, setInput] = useState(currentName);
  const isList = type === "list";

  useEffect(() => {
    if (isList && isInboxList(id)) {
      router.back();
    }
  }, [id, isList]);

  useFocusEffect(
    useCallback(() => {
      setInput(currentName);
    }, [currentName])
  );

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    if (!(id && trimmedInput) || (isList && isInboxList(id))) {
      return;
    }

    if (isList) {
      renameList(id, trimmedInput);
    } else {
      renameItem(id, trimmedInput);
    }

    router.back();
  };

  if (isList && isInboxList(id)) {
    return null;
  }

  return (
    <ContentContainer
      headerTitle={isList ? "Rename List" : "Rename Item"}
      rightAction={{
        icon: "check",
        onPress: handleSubmit,
        show: input.trim().length > 0 && input.trim() !== currentName,
      }}
    >
      <TextInput
        autoFocus
        onChangeText={setInput}
        onSubmit={handleSubmit}
        placeholder={isList ? "List Name" : "Item Name"}
        value={input}
      />
    </ContentContainer>
  );
}
