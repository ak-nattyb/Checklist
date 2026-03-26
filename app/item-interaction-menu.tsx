import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import { n } from "@/utils/scaling";
import { router, useLocalSearchParams } from "expo-router";
import { useChecklistStore } from "@/contexts/ChecklistContext";

export default function ItemInteractionMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemName = useChecklistStore().getEntryName(id);

  return (
    <ContentContainer headerTitle={itemName} style={{ gap: n(20) }}>
      <StyledButton
        text={"Rename"}
        onPress={() => router.push(`/edit-title?id=${id}`)}
      ></StyledButton>
      <StyledButton
        text={"Delete"}
        onPress={() => router.push(`/delete-item?id=${id}`)}
      ></StyledButton>
    </ContentContainer>
  );
}
