import { useMutation } from "@tanstack/react-query";
import { BeerItem } from "@/shared/ui/BeerItem";
import { useState, useEffect } from "react";
import { type Beer, uploadBeer } from "@/api/beer/api";
import {
  RateForm,
  type RateFormValues,
} from "@/features/beer-rating/components/RateForm";
import { BackNavigation } from "@/shared/ui";
import { isEmpty } from "@/shared/utils";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";
import BeerSearchResults from "@/features/beer-search/components/BeerSearchResults";

export const RateBeerPage = () => {
  const navigate = useNavigate();
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

  const {
    mutateAsync: uploadBeerAsync,
    isPending: isUploading,
  } = useMutation({
    mutationFn: uploadBeer,
    onSuccess: () => {
      toast.success("Оцінка успішно збережена!");
      navigate({ to: "/" });
    },
    onError: error => {
      toast.error("Помилка при збереженні оцінки", {
        description: error.message,
      });
    },
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setSelectedBeer(null);
  };

  const handleBeerSelect = (beer: Beer) => {
    setSelectedBeer(beer);
  };

  const onSubmit = async (value: RateFormValues) => {
    if (!selectedBeer) return;
    try {
      const { photos, ...reviewData } = value;

      const beer = {
        ...selectedBeer,
        ...reviewData,
        photos: null, // TODO: Implement photo upload to Supabase Storage
      };
      await uploadBeerAsync(beer as Beer);
    } catch (error) {
      console.error("Failed to upload beer review:", error);
    }
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
          <BeerItem beer={selectedBeer} variant="big" />
        </div>
      )}

      {selectedBeer && (
        <RateForm
          isUploading={isUploading}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};
