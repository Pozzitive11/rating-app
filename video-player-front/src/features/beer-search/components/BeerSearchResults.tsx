import type { UntappdBeer } from "@/api/types";
import { SearchInput } from "./SearchInput";
import SearchHistory from "./SearchHistory";
import { InfoBlock } from "@/shared/ui";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import { Link } from "@tanstack/react-router";

interface BeerSearchResultsProps {
  searchTerm: string;
  handleSearch: (search: string) => void;
  showLoadingState: boolean;
  showResultsList: boolean;
  selectedBeer: UntappdBeer | null;
  searchResults: UntappdBeer[];
  handleBeerSelect: (beer: UntappdBeer) => void;
  searchError?: string;
  linkTo?: string;
  searchHistory?: string[];
  onHistorySelect?: (term: string) => void;
  onHistoryRemove?: (term: string) => void;
  noResults?: boolean;
  randomBeers?: UntappdBeer[];
  isRandomLoading?: boolean;
}

const BeerSearchResults = ({
  searchTerm,
  handleSearch,
  showLoadingState,
  showResultsList,
  selectedBeer,
  searchResults,
  handleBeerSelect,
  searchError,
  linkTo,
  searchHistory = [],
  onHistorySelect,
  onHistoryRemove,
  noResults,
  randomBeers,
  isRandomLoading,
}: BeerSearchResultsProps) => {
  const showHistory =
    !searchTerm &&
    !showLoadingState &&
    !showResultsList &&
    searchHistory.length > 0 &&
    onHistorySelect &&
    onHistoryRemove;

  const showRandomBeers = 
    !searchTerm &&
    !showLoadingState &&
    !showResultsList &&
    randomBeers &&
    randomBeers.length > 0;

  return (
    <div>
      <div className="mb-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
        />
      </div>

      {showHistory && (
        <div className="mb-4">
          <SearchHistory
            history={searchHistory}
            onSelect={onHistorySelect}
            onRemove={onHistoryRemove}
          />
        </div>
      )}

      {showLoadingState && (
        <InfoBlock title="Пошук..." variant="loading" />
      )}

      {!showLoadingState && searchError && (
        <InfoBlock title={searchError} variant="error" />
      )}

      {!showLoadingState && noResults && (
        <InfoBlock title="Нічого не знайдено" variant="info" />
      )}

      {showRandomBeers && !selectedBeer && (
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Рекомендації для вас:
            </h3>
          </div>
          <ul className="space-y-2 max-h-[700px] overflow-y-auto list-none">
            {randomBeers.map(beer => (
              <li
                className="list-none"
                key={beer.untappdId}
                onClick={() => handleBeerSelect(beer)}
              >
                <Link
                  to={linkTo || ""}
                  params={{ beerId: beer.untappdId.toString() }}
                >
                  <BeerListItem beer={beer} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isRandomLoading && !searchTerm && !showLoadingState && !showResultsList && (
        <InfoBlock title="Завантаження рекомендацій..." variant="loading" />
      )}

      {showResultsList && !selectedBeer && (
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">
              Знайдено {searchResults.length} результат(ів):
            </h3>
          </div>
          <ul className="space-y-2 max-h-[700px] overflow-y-auto list-none">
            {searchResults.map(beer => (
              <li
                className="list-none"
                key={beer.untappdId}
                onClick={() => handleBeerSelect(beer)}
              >
                <Link
                  to={linkTo || ""}
                  params={{ beerId: beer.untappdId.toString() }}
                >
                  <BeerListItem beer={beer} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BeerSearchResults;
