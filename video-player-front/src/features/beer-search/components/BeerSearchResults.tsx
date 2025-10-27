import type { Beer } from "@/api/beer/api";
import { SearchInput } from "./SearchInput";
import { ActionBlock } from "@/shared/ui";
import { BeerListItem } from "@/shared/ui/BeerListItem";

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
        <ActionBlock text="Пошук..." variant="loading" />
      )}

      {!showLoadingState && searchError && (
        <ActionBlock text={searchError} variant="error" />
      )}

      {showResultsList && !selectedBeer && (
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">
              Знайдено {searchResults.length} результат(ів):
            </h3>
          </div>
          <ul className="space-y-2 max-h-[700px] overflow-y-auto list-none">
            {searchResults.map((beer, index) => (
              <li
                className="list-none"
                key={index}
                onClick={() => handleBeerSelect(beer)}
              >
                <BeerListItem beer={beer} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BeerSearchResults;
