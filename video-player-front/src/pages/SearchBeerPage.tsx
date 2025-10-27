import { BeerListItem } from "@/shared/ui/BeerListItem";
import { useState, useEffect } from "react";
import { type Beer } from "@/api/beer/api";
import { BackNavigation } from "@/shared/ui";
import { isEmpty } from "@/shared/utils";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";

export const SearchBeerPage = () => {
  const [selectedBeer, setSelectedBeer] =
    useState<Beer | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    showLoadingState,
    searchError,
    showResultsList,
  } = useSearchBeer();

  useEffect(() => {
    if (isEmpty(searchTerm)) {
      setSelectedBeer(null);
    }
  }, [searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  return (
    <>
      <BackNavigation text="Оцінити Пиво" />
      <BeerSearchResults
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        showLoadingState={showLoadingState}
        showResultsList={showResultsList}
        selectedBeer={selectedBeer}
        searchResults={searchResults}
        handleBeerSelect={handleBeerSelect}
        searchError={searchError?.message}
      />

      {selectedBeer && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">
            Обране пиво для оцінки:
          </h3>
          <BeerListItem beer={selectedBeer} />
        </div>
      )}
    </>
  );
};
