import React from "react";

interface BadgeInputProps {
  label: string;
  isSelected: boolean;
  handleToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: "radio" | "checkbox";
  icon?: React.ReactNode;
}

export const BadgeInput = ({
  label,
  isSelected,
  handleToggle,
  icon,
  inputType,
}: BadgeInputProps) => {
  const selectedStyled = "bg-primary text-white border-primary";
  const unselectedStyled = "bg-background text-foreground";
  const toggleStyle = isSelected ? selectedStyled : unselectedStyled;

  return (
    <label
      key={label}
      className={`px-2.5 py-0.5 rounded-full text-xs 
        font-medium cursor-pointer transition-all duration-200 border ${
          toggleStyle
        }`}
    >
      <input
        type={inputType}
        checked={isSelected}
        onChange={handleToggle}
        className="sr-only"
      />
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </label>
  );
};
