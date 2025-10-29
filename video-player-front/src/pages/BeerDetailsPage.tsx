import { useLoaderData } from "@tanstack/react-router";
import { BeerDetailCard } from "@/shared/ui/BeerDetailCard";
import { RatingSection } from "@/features/beer-details/components/RatingSection";
import { AboutSection } from "@/features/beer-details/components/AboutSection";
import { ImagesSection } from "@/features/beer-details/components/ImagesSection";
import { BackNavigation } from "@/shared/ui";

export const BeerDetailsPage = () => {
  const { beer } = useLoaderData({
    from: "/beer-details/$beerId",
  });

  return (
    <>
      <BackNavigation text="Деталі Пива" />
      <div className="mb-4">
        <BeerDetailCard beer={beer} />
      </div>
      <div className="mb-4">
        <RatingSection beerId={beer.id} />
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
