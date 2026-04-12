import { setStringAsync } from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import { StyledText } from "@/components/StyledText";
import {
  type ChecklistItem,
  isInboxList,
  useChecklistStore,
} from "@/contexts/ChecklistContext";
import { getListHref } from "@/utils/routes";
import { n } from "@/utils/scaling";

const getListMarkdown = (name: string, items: ChecklistItem[]) => {
  const lines = [`# ${name}`, ""];

  for (const item of items) {
    lines.push(`- [${item.isChecked ? "x" : " "}] ${item.text}`);
  }

  return lines.join("\n").trimEnd();
};

export default function ListActionsScreen() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const lists = useChecklistStore((state) => state.lists);
  const items = useChecklistStore((state) => state.items);
  const duplicateList = useChecklistStore((state) => state.duplicateList);
  const [copied, setCopied] = useState(false);
  const list = lists.find((candidate) => candidate.id === id);

  if (!list) {
    return (
      <ContentContainer contentGap={20} headerTitle="List Actions">
        <StyledText style={{ fontSize: n(18) }}>List not found.</StyledText>
      </ContentContainer>
    );
  }

  const listItems = items.filter((item) => item.listId === id);
  const isProtectedList = isInboxList(id);

  const handleDuplicate = () => {
    const newListId = duplicateList(id);
    if (newListId) {
      router.dismissTo(getListHref(newListId));
    }
  };

  const handleCopyMarkdown = async () => {
    await setStringAsync(getListMarkdown(list.name, listItems));
    setCopied(true);
  };

  return (
    <ContentContainer contentGap={20} headerTitle={list.name}>
      {!isProtectedList && (
        <>
          <StyledButton
            onPress={() =>
              router.push({
                pathname: "/edit-title",
                params: { id, type: "list" },
              })
            }
            text="Rename"
          />
          <StyledButton
            onPress={() =>
              router.push({
                pathname: "/change-list-icon",
                params: { id },
              } as never)
            }
            text="Change Icon"
          />
          <StyledButton
            onPress={() =>
              router.push({
                pathname: "/delete-list",
                params: { id },
              } as never)
            }
            text="Delete"
          />
          <StyledButton onPress={handleDuplicate} text="Duplicate" />
        </>
      )}
      <StyledButton
        onPress={() =>
          router.push({
            pathname: "/manage-items",
            params: { id },
          } as never)
        }
        text="Manage Items"
      />
      <StyledButton
        onPress={handleCopyMarkdown}
        text={copied ? "Copied" : "Copy as Markdown"}
      />
    </ContentContainer>
  );
}
