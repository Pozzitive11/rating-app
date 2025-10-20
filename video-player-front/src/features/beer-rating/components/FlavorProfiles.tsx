import { BadgeInput, ErrorBlock } from "@/shared/ui";
import { getFlavorProfiles } from "@/api/beer/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/shared/ui/primitives/skeleton";

interface FlavorProfilesProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export const FlavorProfiles = ({
  value,
  onChange,
}: FlavorProfilesProps) => {
  const {
    data: flavorProfiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["flavor-profiles"],
    queryFn: getFlavorProfiles,
  });

  if (error) {
    return (
      <ErrorBlock
        title="Failed to load flavor profiles"
        error={error}
      />
    );
  }

  if (isLoading) {
    return <Skeleton className="w-full h-10" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {flavorProfiles?.map(({ id, name }) => {
        const isSelected = value.includes(id);
        return (
          <BadgeInput
            key={id}
            label={name}
            isSelected={isSelected}
            handleToggle={() => {
              const currentValues = value || [];
              const newValues = isSelected
                ? currentValues.filter(v => v !== id)
                : [...currentValues, id];
              onChange(newValues);
            }}
            inputType="checkbox"
          />
        );
      })}
    </div>
  );
};
