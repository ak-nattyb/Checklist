import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { TextInput } from "@/components/TextInput";

export default function AddItemScreen() {
  const { resetToken } = useLocalSearchParams<{ resetToken?: string }>();
  const [itemName, setItemName] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const lastHandledResetToken = useRef<string | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      setInputKey((currentKey) => currentKey + 1);
    }, [])
  );

  useEffect(() => {
    if (!(resetToken && lastHandledResetToken.current !== resetToken)) {
      return;
    }

    lastHandledResetToken.current = resetToken;
    setItemName("");
    setInputKey((currentKey) => currentKey + 1);
  }, [resetToken]);

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
        key={inputKey}
        onChangeText={setItemName}
        onSubmit={handleNext}
        placeholder="Item Name"
        value={itemName}
      />
    </ContentContainer>
  );
}
