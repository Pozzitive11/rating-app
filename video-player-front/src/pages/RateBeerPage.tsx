import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/features/beer-search/components/SearchInput";
import { BeerItem } from "@/shared/ui/BeerItem";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { searchBeers, type Beer } from "@/api/beer/api";
import { RateForm } from "@/features/beer-rating/components/RateForm";
import { BackNavigation } from "@/shared/ui";
import { useDebounce } from "@/shared/useDebounce";
import { isEmpty } from "@/shared/utils";

export const RateBeerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeer, setSelectedBeer] =
    useState<Beer | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (isEmpty(searchTerm)) {
      setSelectedBeer(null);
    }
  }, [searchTerm]);

  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["searchBeers", debouncedSearchTerm],
    queryFn: () => searchBeers(debouncedSearchTerm),
    enabled: !isEmpty(debouncedSearchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  // Computed search states for better readability
  const hasSearchTerm = !isEmpty(searchTerm);
  const hasDebouncedSearchTerm = !isEmpty(
    debouncedSearchTerm
  );
  const isSearchSynced = searchTerm === debouncedSearchTerm;
  const isSearchComplete = !isSearching && isSearchSynced;
  const hasSearchResults = !isEmpty(searchResults);
  const showLoadingState =
    isSearching || (hasSearchTerm && !isSearchSynced);
  const showErrorState =
    searchError &&
    hasDebouncedSearchTerm &&
    isSearchComplete;
  const showResultsList =
    hasSearchResults &&
    hasDebouncedSearchTerm &&
    isSearchComplete &&
    !selectedBeer;
  const showNoResultsState =
    hasDebouncedSearchTerm &&
    !hasSearchResults &&
    isSearchComplete &&
    !searchError;

  return (
    <>
      <BackNavigation text="Оцінити Пиво" />
      <div className="mb-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
        />
      </div>

      {showLoadingState && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-lg mb-4">
          Пошук пива...
        </div>
      )}

      {showErrorState && (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-4">
          Помилка пошуку: {searchError.message}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchSearch()}
            className="ml-2"
          >
            Спробувати знову
          </Button>
        </div>
      )}

      {showResultsList && (
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">
              Знайдено {searchResults.length} результат(ів):
            </h3>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((beer, index) => (
              <li
                className="list-none"
                key={index}
                onClick={() => handleBeerSelect(beer)}
              >
                <BeerItem beer={beer} variant="small" />
              </li>
            ))}
          </div>
        </div>
      )}

      {selectedBeer && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">
            Обране пиво для оцінки:
          </h3>
          <BeerItem beer={selectedBeer} variant="big" />
        </div>
      )}

      {showNoResultsState && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-lg mb-4">
          Пиво не знайдено
        </div>
      )}

      {selectedBeer && (
        <RateForm
          onSubmit={value => {
            console.log(value);
          }}
        />
      )}
    </>
  );
};
