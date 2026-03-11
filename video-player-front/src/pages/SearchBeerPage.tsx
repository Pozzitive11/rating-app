import { BeerListItem } from "@/shared/ui/BeerListItem";
import { useState, useEffect } from "react";
import type { UntappdBeer } from "@/api/types";
import { isEmpty } from "@/shared/utils";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import useSearchHistory from "@/features/beer-search/hooks/useSearchHistory";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";
import {
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

type SearchParams = {
  q?: string;
};

export const SearchBeerPage = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({
    from: "/search/",
  }) as SearchParams;

  const [selectedBeer, setSelectedBeer] =
    useState<UntappdBeer | null>(null);

  const {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    searchResults,
    showLoadingState,
    searchError,
    showResultsList,
    noResults,
  } = useSearchBeer();

  const {
    history,
    addToHistory,
    removeFromHistory,
  } = useSearchHistory();

  useEffect(() => {
    if (isEmpty(searchTerm)) {
      setSelectedBeer(null);
    }
  }, [searchTerm]);

  // Save to history only when the debounce has settled and matches the typed input
  useEffect(() => {
    if (
      showResultsList &&
      searchResults.length > 0 &&
      debouncedSearchTerm &&
      debouncedSearchTerm === searchTerm
    ) {
      addToHistory(searchTerm);
    }
  }, [showResultsList, searchResults, searchTerm, debouncedSearchTerm, addToHistory]);

  useEffect(() => {
    if (searchTerm !== searchParams.q) {
      navigate({
        to: "/search",
        search: (prev: SearchParams) => ({
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

  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: UntappdBeer) => {
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
        linkTo="/rate-beer/$beerId"
        searchHistory={history}
        onHistorySelect={handleHistorySelect}
        onHistoryRemove={removeFromHistory}
        noResults={noResults}
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
