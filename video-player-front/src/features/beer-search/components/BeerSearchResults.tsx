import type { Beer } from "@/api/beer/api";
import { SearchInput } from "./SearchInput";
import { InfoBlock } from "@/shared/ui";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import { Link } from "@tanstack/react-router";

interface BeerSearchResultsProps {
  searchTerm: string;
  handleSearch: (search: string) => void;
  showLoadingState: boolean;
  showResultsList: boolean;
  selectedBeer: Beer | null;
  searchResults: Beer[];
  handleBeerSelect: (beer: Beer) => void;
  searchError?: string;
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
}: BeerSearchResultsProps) => {
  return (
    <div>
      <div className="mb-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
        />
      </div>

      {showLoadingState && (
        <InfoBlock title="Пошук..." variant="loading" />
      )}

      {!showLoadingState && searchError && (
        <InfoBlock title={searchError} variant="error" />
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
                key={beer.id}
                onClick={() => handleBeerSelect(beer)}
              >
                <Link
                  to="/rate-beer/$beerId"
                  params={{ beerId: beer.id }}
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
