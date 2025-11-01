import { useState } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Tabs } from "@/shared/ui/Tabs";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";
import { type Beer } from "@/api/beer/api";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedBeer, setSelectedBeer] =
    useState<Beer | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    showLoadingState,
    showResultsList,
    searchError,
  } = useSearchBeer();

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

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
        <BeerSearchResults
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          showLoadingState={showLoadingState}
          showResultsList={showResultsList}
          selectedBeer={selectedBeer}
          searchResults={searchResults}
          handleBeerSelect={handleBeerSelect}
          searchError={searchError?.message}
          linkTo="/beer-details/$beerId"
        />
      )}

      {activeTab === "ratings" && (
        <div>
          <h1>My Ratings</h1>
        </div>
      )}
    </>
  );
};
