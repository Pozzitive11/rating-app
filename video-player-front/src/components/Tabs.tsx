import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MainTabs = ({
  ratedBeersNumber,
  activeTab,
  setActiveTab,
}: {
  ratedBeersNumber: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="search">Пошук</TabsTrigger>
        <TabsTrigger value="ratings">
          Мої оцінки ({ratedBeersNumber})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
