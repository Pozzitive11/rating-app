import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BeerDetailCard } from "@/shared/ui/BeerDetailCard";
import { RatingSection } from "@/features/beer-details/components/RatingSection";
import { AboutSection } from "@/features/beer-details/components/AboutSection";
import { ImagesSection } from "@/features/beer-details/components/ImagesSection";
import { BackNavigation, InfoBlock } from "@/shared/ui";
import { getUntappdBeerDetailsById } from "@/api/beer/api";

export const BeerDetailsPage = () => {
  const { beerId } = useParams({
    from: "/beer-details/$beerId",
  });

  const {
    data: beer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["beer-details", beerId],
    queryFn: () =>
      getUntappdBeerDetailsById(Number(beerId)),
  });

  if (isLoading) {
    return (
      <InfoBlock
        variant="loading"
        title="Завантаження деталей пива..."
        description="Будь ласка, зачекайте"
      />
    );
  }

  if (error || !beer) {
    return (
      <InfoBlock
        variant="error"
        title="Помилка завантаження"
        description="Не вдалося завантажити деталі пива"
      />
    );
  }

  return (
    <>
      <BackNavigation text="Деталі Пива" />
      <div className="mb-4">
        <BeerDetailCard beer={beer} />
      </div>
      <div className="mb-4">
        <RatingSection
          beerId={beer.id}
          userRating={3.25}
          communityRating={beer.rating}
          numberOfRatings={beer.numberOfRatings}
          rateDate={new Date().toISOString()}
        />
      </div>
      <div className="mb-4">
        <AboutSection description={beer.description} />
      </div>
      <div className="mb-4">
        <ImagesSection images={beer.images} />
      </div>
    </>
  );
};
