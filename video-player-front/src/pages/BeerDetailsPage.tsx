import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BeerDetailCard } from "@/shared/ui/BeerDetailCard";
import { RatingSection } from "@/features/beer-details/components/RatingSection";
import { AboutSection } from "@/features/beer-details/components/AboutSection";
import { ImagesSection } from "@/features/beer-details/components/ImagesSection";
import { BackNavigation, InfoBlock } from "@/shared/ui";
import { getMyBeerRating, getUntappdBeerDetailsById } from "@/api/beer/api";

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

  const {
    data: myBeerRating,
    isLoading: isMyBeerRatingLoading,
    error: myBeerRatingError,
  } = useQuery({
    queryKey: ["my-beer-rating", beerId],
    queryFn: () => getMyBeerRating(Number(beerId)),
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

  const { untappd, community } = beer;

  return (
    <>
      <BackNavigation text="Деталі Пива" />
      <div className="mb-4">
        <BeerDetailCard beer={untappd} />
      </div>
      <div className="mb-4">
        <RatingSection
          beerId={untappd.untappdId}
          userRating={myBeerRating?.rating}
          communityRating={community.communityRating}
          numberOfRatings={community.communityNumberOfRatings}
          untappdRating={untappd.untappdRating}
          untappdNumberOfRatings={untappd.untappdNumberOfRatings}
          rateDate={myBeerRating?.createdAt}
          isLoading={isMyBeerRatingLoading}
          error={myBeerRatingError}
        />
      </div>
      <div className="mb-4">
        <AboutSection description={untappd.description} />
      </div>
      <div className="mb-4">
        <ImagesSection images={[]} />
      </div>
    </>
  );
};
