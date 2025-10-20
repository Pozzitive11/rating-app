import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { SearchInput } from "@/features/beer-search/components/SearchInput";
import { BeerItem } from "@/shared/ui/BeerItem";
import { useState, useEffect } from "react";
import {
  searchBeers,
  type Beer,
  uploadBeer,
} from "@/api/beer/api";
import {
  RateForm,
  type RateFormValues,
} from "@/features/beer-rating/components/RateForm";
import { BackNavigation } from "@/shared/ui";
import { useDebounce } from "@/shared/useDebounce";
import { isEmpty } from "@/shared/utils";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const RateBeerPage = () => {
  const navigate = useNavigate();
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
  } = useQuery({
    queryKey: ["searchBeers", debouncedSearchTerm],
    queryFn: () => searchBeers(debouncedSearchTerm),
    enabled: !isEmpty(debouncedSearchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
  const {
    mutateAsync: uploadBeerAsync,
    isPending: isUploading,
  } = useMutation({
    mutationFn: uploadBeer,
    onSuccess: () => {
      toast.success("Оцінка успішно збережена!", {
        description: "Дякуємо за вашу оцінку",
        duration: 3000,
      });
      // Navigate to home page after successful submission
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    },
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    console.log(beer);
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

  const onSubmit = async (value: RateFormValues) => {
    if (!selectedBeer) return;
    try {
      // Note: Photos (File objects) are not sent yet - need to implement file upload
      const { photos, ...reviewData } = value;

      const beer = {
        ...selectedBeer,
        ...reviewData,
        photos: null, // TODO: Implement photo upload to Supabase Storage
      };
      await uploadBeerAsync(beer as Beer);
    } catch (error) {
      console.error("Failed to upload beer review:", error);
      // Error is already handled by the API error handler and React Query
    }
  };

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

      {isUploading && (
        <div className="text-center text-blue-600 bg-blue-50 p-4 rounded-lg mb-4">
          Збереження оцінки...
        </div>
      )}

      {selectedBeer && <RateForm onSubmit={onSubmit} />}
    </>
  );
};
