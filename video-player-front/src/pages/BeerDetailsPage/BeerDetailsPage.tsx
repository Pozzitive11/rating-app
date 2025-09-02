import { ArrowLeftIcon } from "lucide-react";
import { Link, useLoaderData } from "@tanstack/react-router";
import BeerItemBig from "@/components/BeerItemBig";
import { mockBeers } from "@/mock-data";
import RatingSection from "./components/RatingSection";
import AboutSection from "./components/AboutSection";
import ImagesSection from "./components/ImagesSection";

export default function BeerDetailsPage() {
  const { beerId } = useLoaderData({ from: "/$id" });
  const beer = mockBeers.find((beer) => beer.id === beerId);
  return (
    <>
      <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
        <ArrowLeftIcon className="w-4 h-4" />
        Деталі Пива
      </Link>
      <div className="mb-4">
        <BeerItemBig beer={beer!} />
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
}
