import { Barrel, Beer, BottleWine, Package } from "lucide-react";

export interface PresentationStyle {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const presentationStylesConfig: PresentationStyle[] = [
  {
    id: "1",
    label: "Пляшка",
    icon: <BottleWine strokeWidth={1.25} className="w-4 h-4" />,
  },
  {
    id: "2",
    label: "Кухоль",
    icon: <Beer strokeWidth={1.25} className="w-4 h-4" />,
  },
  {
    id: "3",
    label: "Бочка",
    icon: <Barrel strokeWidth={1.25} className="w-4 h-4" />,
  },
  {
    id: "4",
    label: "Банка",
    icon: <Package strokeWidth={1.25} className="w-4 h-4" />,
  },
];
