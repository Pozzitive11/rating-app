import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BeerListItem } from "@/shared/ui/BeerListItem";
import { getUntappdBeerDetailsById, uploadBeer } from "@/api/beer/api";
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
      const { untappd } = selectedBeer;
      const payload = {
        untappdId: untappd.untappdId,
        name: untappd.name,
        brewery: untappd.brewery,
        style: untappd.style,
        abv: untappd.abv,
        ibu: untappd.ibu,
        untappdRating: untappd.untappdRating,
        userRating: value.rating,
        link: untappd.link,
        mainImage: untappd.mainImage,
        description: untappd.description,
        comment: value.comment || null,
        location: value.location || null,
        photos: null, // TODO: Implement photo upload to Supabase Storage
        flavorProfiles: value.flavorProfiles,
        presentationStyle: value.presentationStyle!,
      };
      await uploadBeerAsync(payload);
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
            <BeerListItem
              beer={{
                ...selectedBeer.untappd,
              }}
            />
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
