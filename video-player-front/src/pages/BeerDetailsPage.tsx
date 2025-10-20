import { useLoaderData } from "@tanstack/react-router";
import { BeerItem } from "@/shared/ui/BeerItem";
import { RatingSection } from "@/features/beer-details/components/RatingSection";
import { AboutSection } from "@/features/beer-details/components/AboutSection";
import { ImagesSection } from "@/features/beer-details/components/ImagesSection";
import { BackNavigation } from "@/shared/ui";

export const BeerDetailsPage = () => {
  const { beerId } = useLoaderData({
    from: "/beer-details/$beerId",
  });

  return (
    <>
      <BackNavigation text="Деталі Пива" />
      <div className="mb-4">
        <BeerItem beer={beer!} variant="big" />
      </div>
      <div className="mb-4">
        <RatingSection
          beerId={beerId}
          rating={beer!.rating}
          numberOfRatings={beer!.numberOfRatings}
        />
      </div>
      <div className="mb-4">
        <AboutSection description={beer!.description} />
      </div>
      <div className="mb-4">
        <ImagesSection images={beer!.images} />
      </div>
    </>
  );
};
