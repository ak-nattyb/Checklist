import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ChecklistFolder } from "@/components/ChecklistFolder";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";
import { useHasCheckedItems } from "@/hooks/useHasCheckedItems";
import { router } from "expo-router";
import { RecurringChecklistItem } from "@/components/RecurringChecklistItem";

export default function Tab() {
  const { entries, getEntryName, activeFolderId, setActiveFolderId } =
    useChecklistStore();
  const { displayMode } = useDisplayMode();
  const hasCheckedItems = useHasCheckedItems();

  const headerTitle =
    activeFolderId === "" ? "Checklist" : getEntryName(activeFolderId);
  const visibleEntries = activeFolderId
    ? entries.filter((e) => e.location === getEntryName(activeFolderId))
    : entries.filter((e) => e.location === "");

  return (
    <ContentContainer
      headerTitle={headerTitle}
      hideBackButton={activeFolderId === ""}
      style={{ paddingHorizontal: n(20) }}
      rightIcon="delete-outline"
      showRightIcon={hasCheckedItems}
      onRightIconPress={() =>
        router.push(
          `/bulk-delete-checked-items?id=${
            useChecklistStore.getState().activeFolderId
              ? useChecklistStore
                  .getState()
                  .getEntryName(useChecklistStore.getState().activeFolderId)
              : ""
          }`,
        )
      }
    >
      <CustomScrollView
        data={visibleEntries}
        renderItem={({ item }) =>
          item.kind === "item" ? (
            <ChecklistItem
              id={item.id}
              text={item.text}
              location={item.location}
            />
          ) : item.kind === "recurringitem" ? (
            <RecurringChecklistItem
              id={item.id}
              text={item.text}
              location={item.location}
            />
          ) : (
            <ChecklistFolder
              id={item.id}
              text={item.text}
              location={item.location}
              onPress={() => setActiveFolderId(item.id)}
            />
          )
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          displayMode === "Lg"
            ? { gap: n(25) } //100%
            : displayMode === "Md"
              ? { gap: n(20) } //80%
              : { gap: n(15) } //60%
        }
      />
    </ContentContainer>
  );
}
