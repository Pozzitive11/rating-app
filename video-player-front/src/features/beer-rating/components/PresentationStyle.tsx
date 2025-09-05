import BadgeInput from "@/shared/ui/BadgeInput";
import { presentationStylesConfig } from "@/features/beer-rating/constants/presentation-styles";

interface PresentationStyleProps {
  value: string;
  onChange: (value: string) => void;
}

export function PresentationStyle({ value, onChange }: PresentationStyleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presentationStylesConfig.map(({ id, label, icon }) => {
        const isSelected = value === id;
        return (
          <BadgeInput
            key={id}
            label={label}
            isSelected={isSelected}
            handleToggle={() => onChange(id)}
            icon={icon}
            inputType="radio"
          />
        );
      })}
    </div>
  );
}
