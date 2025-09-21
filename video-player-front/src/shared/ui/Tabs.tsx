import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/primitives/tabs";

export const Tabs = ({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: {
    label: string;
    value: string;
  }[];
}) => {
  return (
    <ShadcnTabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="cursor-pointer"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadcnTabs>
  );
};
