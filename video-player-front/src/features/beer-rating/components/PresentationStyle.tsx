import { BadgeInput } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { getPresentationStyles } from "@/api/beer/api";
import { Skeleton } from "@/shared/ui/primitives/skeleton";

interface PresentationStyleProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const PresentationStyle = ({
  value,
  onChange,
}: PresentationStyleProps) => {
  const { data: presentationStyles, isLoading } = useQuery({
    queryKey: ["presentation-styles"],
    queryFn: getPresentationStyles,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-10" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {presentationStyles?.map(({ id, name }) => {
        const isSelected = value === id;
        return (
          <BadgeInput
            key={id}
            label={name}
            isSelected={isSelected}
            handleToggle={() => onChange(id)}
            // icon={icon}
            inputType="radio"
          />
        );
      })}
    </div>
  );
};
