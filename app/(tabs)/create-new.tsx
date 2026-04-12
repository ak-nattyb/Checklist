import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { TextInput } from "@/components/TextInput";

export default function AddItemScreen() {
  const [itemName, setItemName] = useState("");

  useFocusEffect(
    useCallback(() => {
      setItemName("");
    }, [])
  );

  const handleNext = () => {
    const trimmedName = itemName.trim();
    if (!trimmedName) {
      return;
    }

    router.push({
      pathname: "/add-to-list",
      params: { itemName: trimmedName },
    });
  };

  return (
    <ContentContainer
      headerTitle="Quick Add"
      hideBackButton
      rightAction={{
        icon: "arrow-forward",
        onPress: handleNext,
        show: itemName.trim().length > 0,
      }}
    >
      <TextInput
        autoFocus
        onChangeText={setItemName}
        onSubmit={handleNext}
        placeholder="Item Name"
        value={itemName}
      />
    </ContentContainer>
  );
}
