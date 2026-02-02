import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import {
  type Beer,
  getUntappdBeerDetailsById,
  uploadBeer,
} from "@/api/beer/api";
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

export const RateBeerPage = () => {
  const queryClient = useQueryClient();
  const { beerId } = useParams({
    from: "/rate-beer/$beerId",
  });
  const navigate = useNavigate();

  const parsedBeerId = Number(beerId);
  const isBeerIdValid = Number.isFinite(parsedBeerId);

  const {
    data: selectedBeer,
    isLoading: isBeerLoading,
    error: beerError,
  } = useQuery({
    queryKey: ["untappd-beer", parsedBeerId],
    queryFn: () => getUntappdBeerDetailsById(parsedBeerId),
    enabled: isBeerIdValid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    mutateAsync: uploadBeerAsync,
    isPending: isUploading,
  } = useMutation({
    mutationFn: uploadBeer,
    onSuccess: () => {
      toast.success("Оцінка успішно збережена!");
      queryClient.invalidateQueries({
        queryKey: ["beer-details", beerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-beer-rating", beerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-ratings"],
      });
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

      const beer: Beer = {
        untappdId: selectedBeer.id,
        ...selectedBeer,
        ...reviewData,
        photos: null, // TODO: Implement photo upload to Supabase Storage
      };
      await uploadBeerAsync(beer);
    } catch (error) {
      console.error("Failed to upload beer review:", error);
    }
  };

  if (isBeerLoading) {
    return (
      <InfoBlock
        title="Завантаження пива..."
        variant="loading"
      />
    );
  }
  if (beerError instanceof Error) {
    return (
      <InfoBlock
        title={beerError.message}
        variant="error"
      />
    );
  }

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
