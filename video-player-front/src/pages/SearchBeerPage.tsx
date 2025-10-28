import { BeerListItem } from "@/shared/ui/BeerListItem";
import { useState, useEffect } from "react";
import { type Beer } from "@/api/beer/api";
import { isEmpty } from "@/shared/utils";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";
import { Route } from "@/routes/search";

export const SearchBeerPage = () => {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

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

  useEffect(() => {
    if (searchTerm !== searchParams.q) {
      navigate({
        to: "/search",
        search: prev => ({
          ...prev,
          q: searchTerm || undefined,
        }),
        replace: true,
      });
    }
  }, [searchTerm, searchParams.q, navigate]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  return (
    <>
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
