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
}
