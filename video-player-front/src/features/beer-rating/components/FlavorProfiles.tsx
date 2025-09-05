import BadgeInput from "@/shared/ui/BadgeInput";
import { flavorProfiles } from "@/features/beer-rating/constants/flavor-profiles";

interface FlavorProfilesProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function FlavorProfiles({
  value,
  onChange,
}: FlavorProfilesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {flavorProfiles.map(({ id, label }) => {
        const isSelected = value.includes(id);
        return (
          <BadgeInput
            key={id}
            label={label}
            isSelected={isSelected}
            handleToggle={() => {
              const currentValues = value || [];
              const newValues = isSelected
                ? currentValues.filter((v) => v !== id)
                : [...currentValues, id];
              onChange(newValues);
            }}
            inputType="checkbox"
          />
        );
      })}
    </div>
  );
}
