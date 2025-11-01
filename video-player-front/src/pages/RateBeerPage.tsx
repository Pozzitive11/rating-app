import { useMutation } from "@tanstack/react-query";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import { type Beer, uploadBeer } from "@/api/beer/api";
import {
  RateForm,
  type RateFormValues,
} from "@/features/beer-rating/components/RateForm";
import { InfoBlock } from "@/shared/ui";
import {
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { toast } from "sonner";
import useSearchBeer from "@/features/beer-search/hooks/useSearchBeer";

export const RateBeerPage = () => {
  const { beerId } = useParams({
    from: "/rate-beer/$beerId",
  });
  const navigate = useNavigate();

  const { searchResults } = useSearchBeer();
  console.log(searchResults);
  const selectedBeer = searchResults.find(
    beer => beer.id === Number(beerId)
  );
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
      {selectedBeer ? (
        <>
          <div className="mb-4">
            <BeerListItem beer={selectedBeer} />
          </div>
          <RateForm
            isUploading={isUploading}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        <InfoBlock
          title="Пиво не знайдено"
          variant="error"
        />
      )}
    </>
  );
};
