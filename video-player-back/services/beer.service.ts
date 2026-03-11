import { supabaseHelpers } from "../models/supabase";
import { NotFoundError } from "../middleware/errorHandler";
import {
  BeerReview,
  BeerReviewInsert,
  BeerDetailsResponse,
  BeerReviewListItem,
  UserRatingResponse,
  UntappdBeer,
  FlavorProfile,
  PresentationStyle,
} from "../types";
import { CreateBeerReviewInput } from "../schemas/beer.schema";
import {
  fetchUntappdBeerDetailsById,
  fetchUntappdBeers,
} from "../middleware/untappd";

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
      untappd_id: reviewData.untappdId,
      name: reviewData.name,
      user_id: userId,
      brewery: reviewData.brewery || null,
      style: reviewData.style || null,
      untappd_rating: reviewData.untappdRating || null,
      user_rating: reviewData.userRating,
      abv: reviewData.abv || null,
      ibu: reviewData.ibu || null,
      link: reviewData.link || null,
      main_image: reviewData.mainImage || null,
      description: reviewData.description || null,
      comment: reviewData.comment || null,
      location: reviewData.location || null,
      photos: reviewData.photos || null,
      presentation_style: reviewData.presentationStyle,
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
  async getMyBeerRating(
    untappdBeerId: number,
    userId: string
  ): Promise<UserRatingResponse | null> {
    const rating = await supabaseHelpers.getMyBeerRating(untappdBeerId, userId);
    if (!rating) return null;
    return {
      rating: rating.user_rating,
      createdAt: rating.created_at,
    };
  }

  async searchUntappdBeers(query: string): Promise<UntappdBeer[]> {
    return await fetchUntappdBeers(query);
  }

  async getBeerDetailsById(id: number): Promise<BeerDetailsResponse> {
    const beer = await fetchUntappdBeerDetailsById(id);

    if (!beer) {
      throw new NotFoundError(`Beer with id "${id}" not found`);
    }

    const community = await supabaseHelpers.getCommunityRating(beer.untappdId);

    return {
      untappd: beer,
      community,
    };
  }

  async getMyAllRatings(userId: string): Promise<BeerReviewListItem[]> {
    const ratings = await supabaseHelpers.getMyAllRatings(userId);
    return ratings.map(toBeerReviewListItem);
  }
}

function toBeerReviewListItem(review: BeerReview): BeerReviewListItem {
  return {
    id: review.untappd_id ?? review.id,
    untappdId: review.untappd_id ?? undefined,
    name: review.name,
    brewery: review.brewery ?? "",
    style: review.style ?? "",
    abv: review.abv ?? 0,
    ibu: review.ibu ?? 0,
    userRating: review.user_rating ?? 0,
    mainImage: review.main_image ?? "",
    images: review.photos ?? [],
    description: review.description ?? "",
    presentationStyle: review.presentation_style,
    photos: review.photos ?? null,
    untappdRating: review.untappd_rating ?? null,
  };
}
