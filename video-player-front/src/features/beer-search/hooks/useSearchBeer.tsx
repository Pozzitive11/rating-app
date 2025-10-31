import { searchUntappdBeers } from "@/api/beer/api";
import { useDebounce } from "@/shared/useDebounce";
import { isEmpty } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useSearchBeer = () => {
  const [searchTerm, setSearchTerm] = useState("mova");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["searchBeers", debouncedSearchTerm],
    queryFn: () => searchUntappdBeers(debouncedSearchTerm),
    enabled: !isEmpty(debouncedSearchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const hasSearchTerm = !isEmpty(debouncedSearchTerm);
  const hasDebouncedSearchTerm = !isEmpty(
    debouncedSearchTerm
  );
  const isSearchSynced = debouncedSearchTerm === searchTerm;
  const isSearchComplete = !isSearching && isSearchSynced;
  const hasSearchResults = !isEmpty(searchResults);
  const showLoadingState =
    isSearching || (hasSearchTerm && !isSearchSynced);
  const showResultsList =
    hasSearchResults &&
    hasDebouncedSearchTerm &&
    isSearchComplete;

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    searchError,
    showLoadingState,
    showResultsList,
  };
};

export default useSearchBeer;
