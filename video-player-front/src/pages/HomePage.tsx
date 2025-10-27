import { useState } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Tabs } from "@/shared/ui/Tabs";
import { SearchInput } from "@/features/beer-search/components/SearchInput";

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">
          🍺 Beer Rater
        </h1>
        <p className="text-muted-foreground text-responsive">
          Відкривай та оцінюй свої улюблені сорти пива
        </p>
      </header>

      <div className="mb-8">
        <Link to="/search">
          <Button
            className="w-full h-10 text-lg font-semibold bg-primary cursor-pointer"
            size="lg"
          >
            <Plus className="w-8 h-8" />
            Додати нову оцінку
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { label: "Пошук", value: "search" },
            {
              label: `Мої оцінки (${0})`,
              value: "ratings",
            },
          ]}
        />
      </div>

      {activeTab === "search" && (
        <>
          <div className="mb-6">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="flex gap-2 flex-col">
            {/* {mockBeers.map(beer => (
              <BeerItem
                key={beer.id}
                beer={beer}
                variant="small"
                linkTo="/beer-details/$beerId"
              />
            ))} */}
          </div>
        </>
      )}

      {activeTab === "ratings" && (
        <div>
          <h1>My Ratings</h1>
        </div>
      )}
    </>
  );
};
