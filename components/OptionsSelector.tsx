import ContentContainer from "./ContentContainer";
import { StyledButton } from "./StyledButton";

interface Option<Value extends string = string> {
  label: string;
  value: Value;
}

interface OptionsSelectorProps<Value extends string> {
  onSelect: (value: Value) => void;
  options: Option<Value>[];
  selectedValue: Value;
  title: string;
}

export function OptionsSelector<Value extends string>({
  title,
  options,
  selectedValue,
  onSelect,
}: OptionsSelectorProps<Value>) {
  return (
    <ContentContainer headerTitle={title}>
      {options.map((option) => (
        <StyledButton
          key={option.value}
          onPress={() => onSelect(option.value)}
          selected={selectedValue === option.value}
          text={option.label}
        />
      ))}
    </ContentContainer>
  );
}
