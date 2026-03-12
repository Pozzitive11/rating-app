import { apiGet, apiPost } from "../auth-interceptor";
import type {
  FlavorProfile,
  PresentationStyle,
  BeerReview,
  BeerDetailsResponse,
  UntappdBeer,
  UserRatingResponse,
  CreateBeerReviewInput,
  MyRatingListItem,
} from "../types";

// Get beer review by DB id (Supabase)
export const getBeerById = async (id: number): Promise<BeerReview> => {
  return await apiGet<BeerReview>(`/supabase/beer/${id}`);
};

// Create beer review (Supabase). Returns new review id.
export const uploadBeer = async (
  payload: CreateBeerReviewInput
): Promise<number> => {
  return await apiPost<number>(`/supabase/beer`, payload);
};

// Search Untappd
export const searchUntappdBeers = async (
  query: string
): Promise<UntappdBeer[]> => {
  return await apiGet<UntappdBeer[]>(
    `/untappd/search/${encodeURIComponent(query.trim())}`
  );
};

// Get random beers for the home page
export const getRandomBeers = async (): Promise<UntappdBeer[]> => {
  return await apiGet<UntappdBeer[]>(`/untappd/random`);
};

// Beer details (Untappd + community)
export const getUntappdBeerDetailsById = async (
  id: number
): Promise<BeerDetailsResponse> => {
  return await apiGet<BeerDetailsResponse>(`/untappd/beer/${id}`);
};

// Flavor profiles (Supabase)
export const getFlavorProfiles = async (): Promise<FlavorProfile[]> => {
  return await apiGet<FlavorProfile[]>(`/supabase/flavor-profiles`);
};

// Presentation styles (Supabase)
export const getPresentationStyles = async (): Promise<
  PresentationStyle[]
> => {
  return await apiGet<PresentationStyle[]>(
    `/supabase/presentation-styles`
  );
};

// My rating for a beer by Untappd id (auth required)
export const getMyBeerRating = async (
  beerId: number
): Promise<UserRatingResponse | null> => {
  return await apiGet<UserRatingResponse | null>(
    `/supabase/beer/${beerId}/my-rating`
  );
};

// All my ratings (auth required)
export const getMyAllRatings = async (): Promise<MyRatingListItem[]> => {
  return await apiGet<MyRatingListItem[]>(`/supabase/beer/my-all-ratings`);
};
