import { apiGet, apiPost } from "../auth-interceptor";
import type {
  FlavorProfile,
  PresentationStyle,
} from "../types";

export interface Beer {
  id: number;
  untappdId?: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  userRating?: number;
  numberOfRatings: number;
  mainImage: string;
  images: string[];
  description: string;
  glassType: string;
  photos?: string[] | null;
}


// Get all beers
export const getBeers = async (
  name?: string
): Promise<Beer[]> => {
  const response = await apiGet<{ beers: Beer[] }>(
    `/beers?name=${name}`
  );
  return response.beers;
};

// Get specific beer
export const getBeerById = async (
  id: number
): Promise<Beer> => {
  return await apiGet<Beer>(`/supabase/beer/${id}`);
};

// Upload beer
export const uploadBeer = async (
  beer: Beer
): Promise<Beer> => {
  return await apiPost<Beer>(`/supabase/beer`, beer);
};

// Search beers by query
export const searchUntappdBeers = async (
  query: string
): Promise<Beer[]> => {
  return await apiGet<Beer[]>(
    `/untappd/search/${encodeURIComponent(query.trim())}`
  );
};

// Get a beer from Untappd
export const getUntappdBeerDetailsById = async (
  id: number
): Promise<Beer> => {
  return await apiGet<Beer>(`/untappd/beer/${id}`);
};

// Get all flavor profiles
export const getFlavorProfiles = async (): Promise<
  FlavorProfile[]
> => {
  return await apiGet<FlavorProfile[]>(
    `/supabase/flavor-profiles`
  );
};
// Get all presentation styles
export const getPresentationStyles = async (): Promise<
  PresentationStyle[]
> => {
  return await apiGet<PresentationStyle[]>(
    `/supabase/presentation-styles`
  );
};

// Get my beer rating
export const getMyBeerRating = async (beerId: number) => {
  return await apiGet<{ rating: number; created_at: string } | null>(
    `/supabase/beer/${beerId}/my-rating`
  );
};

// Get my all ratings
export const getMyAllRatings = async () => {
  return await apiGet<Beer[]>(
    `/supabase/beer/my-all-ratings`
  );
};