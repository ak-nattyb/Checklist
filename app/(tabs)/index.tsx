import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ChecklistFolder } from "@/components/ChecklistFolder";
import { useChecklistStore } from "@/contexts/ChecklistContext";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

export default function Tab() {
  const { entries, getEntryName, activeFolderId, setActiveFolderId } =
    useChecklistStore();
  const { displayMode } = useDisplayMode();

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
    >
      <CustomScrollView
        data={visibleEntries}
        onLongPress={}
        renderItem={({ item }) =>
          item.kind === "item" ? (
            <ChecklistItem
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
