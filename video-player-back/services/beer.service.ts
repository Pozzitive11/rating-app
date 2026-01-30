import { supabaseHelpers } from "@/models/supabase";
import { NotFoundError } from "@/middleware/errorHandler";
import { BeerReviewInsert, OriginalBeer, BeerReview } from "@/types";
import { CreateBeerReviewInput } from "@/schemas/beer.schema";
import {
  fetchUntappdBeerDetailsById,
  fetchUntappdBeers,
} from "@/middleware/untappd";
import { FlavorProfile, PresentationStyle } from "@/types";

export class BeerService {
  async getBeerById(id: number): Promise<BeerReview> {
    const beer = await supabaseHelpers.getBeerById(id);

    if (!beer) {
      throw new NotFoundError(`Beer with id "${id}" not found`);
    }

    return beer;
  }

  async getFlavorProfiles(): Promise<FlavorProfile[]> {
    const flavorProfiles = await supabaseHelpers.getFlavorProfiles();
    if (!flavorProfiles || flavorProfiles.length === 0) {
      throw new NotFoundError("Flavor profiles not found");
    }
    return flavorProfiles;
  }

  async getPresentationStyles(): Promise<PresentationStyle[]> {
    const presentationStyles = await supabaseHelpers.getPresentationStyles();
    if (!presentationStyles || presentationStyles.length === 0) {
      throw new NotFoundError("Presentation styles not found");
    }
    return presentationStyles;
  }

  async createBeerReview(
    reviewData: CreateBeerReviewInput,
    userId: string,
    accessToken: string
  ): Promise<BeerReview> {
    // Transform API format (camelCase) to DB format (snake_case)
    const dbReviewData: BeerReviewInsert = {
      untappd_id: reviewData.untappdId || null,
      name: reviewData.name,
      user_id: userId,
      brewery: reviewData.brewery || "",
      style: reviewData.style || null,
      rating: reviewData.rating,
      abv: reviewData.abv || null,
      ibu: reviewData.ibu || null,
      link: reviewData.link || null,
      main_image: reviewData.mainImage || null,
      description: reviewData.description || null,
      comment: reviewData.comment || null,
      location: reviewData.location || null,
      photos: reviewData.photos || null,
      presentation_style: reviewData.presentationStyle || null,
      created_at: new Date().toISOString(),
    };

    // Create the beer review (with authenticated client for RLS)
    const savedReview = await supabaseHelpers.saveBeer(
      dbReviewData,
      accessToken
    );

    // Save flavor profiles if provided
    if (reviewData.flavorProfiles && reviewData.flavorProfiles.length > 0) {
      await supabaseHelpers.saveBeerReviewFlavorProfiles(
        savedReview.id,
        reviewData.flavorProfiles,
        accessToken
      );
    }

    return savedReview;
  }

  async saveBeerReviewFlavorProfiles(
    beerReviewId: number,
    flavorProfileIds: number[],
    accessToken: string
  ): Promise<void> {
    await supabaseHelpers.saveBeerReviewFlavorProfiles(
      beerReviewId,
      flavorProfileIds,
      accessToken
    );
  }
  // service
  async getMyBeerRating(untappdBeerId: number, userId: string): Promise<Pick<BeerReview, "rating" | "created_at"> | null> {
    const rating = await supabaseHelpers.getMyBeerRating(untappdBeerId, userId);
    return rating ?? null;
  }

  async searchUntappdBeers(query: string): Promise<OriginalBeer[]> {
    const beers = await fetchUntappdBeers(query);

    if (beers.length === 0) {
      throw new NotFoundError(`No beers found for "${query}"`);
    }

    return beers;
  }

  async getUntappdBeerDetailsById(id: number): Promise<OriginalBeer> {
    const beer = await fetchUntappdBeerDetailsById(id);

    if (!beer) {
      throw new NotFoundError(`Beer with id "${id}" not found`);
    }

    return beer;
  }

  async getMyAllRatings(
    userId: string
  ): Promise<BeerReviewResponse[]> {
    const ratings = await supabaseHelpers.getMyAllRatings(userId);
    return ratings.map(mapBeerReviewToResponse);
  }
}

type BeerReviewResponse = {
  id: number;
  untappdId?: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  userRating: number;
  numberOfRatings: number;
  mainImage: string;
  images: string[];
  description: string;
  glassType: string;
  photos?: string[] | null;
};

const mapBeerReviewToResponse = (
  review: BeerReview
): BeerReviewResponse => ({
  id: review.untappd_id ?? review.id,
  untappdId: review.untappd_id ?? undefined,
  name: review.name,
  brewery: review.brewery ?? "",
  style: review.style ?? "",
  abv: review.abv ?? 0,
  ibu: review.ibu ?? 0,
  rating: review.rating,
  userRating: review.rating,
  numberOfRatings: review.number_of_ratings ?? 0,
  mainImage: review.main_image ?? "",
  images: review.photos ?? [],
  description: review.description ?? "",
  glassType: "",
  photos: review.photos ?? null,
});
