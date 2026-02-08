import type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Database,
} from "./database.types";

// Re-export Supabase Database and helpers
export type { Database };

// Supabase table types (snake_case rows)
export type FlavorProfile = Tables<"flavor_profiles">;
export type PresentationStyle = Tables<"presentation_styles">;
export type BeerReview = Tables<"beer_reviews">;
export type BeerReviewInsert = TablesInsert<"beer_reviews">;
export type BeerReviewUpdate = TablesUpdate<"beer_reviews">;
export type BeerReviewFlavorProfile =
  Tables<"beer_review_flavor_profiles">;
export type BeerReviewFlavorProfileInsert =
  TablesInsert<"beer_review_flavor_profiles">;
export type User = Tables<"users">;

// API response types (camelCase, from backend index 16–47)
export interface UntappdBeer {
  untappdId: number;
  name: string;
  brewery: string | null;
  style: string | null;
  abv: number | null;
  ibu: number | null;
  untappdRating: number | null;
  link: string | null;
  mainImage: string | null;
}

export interface UntappdBeerDetails extends UntappdBeer {
  description: string | null;
  untappdNumberOfRatings: number | null;
}

export interface CommunityRatingSummary {
  communityRating: number | null;
  communityNumberOfRatings: number;
}

export interface BeerDetailsResponse {
  untappd: UntappdBeerDetails;
  community: CommunityRatingSummary;
}

/** Response for GET /api/beer/:id/my-rating (auth required) */
export interface UserRatingResponse {
  rating: number;
  createdAt: string;
}

/** Payload for POST /api/supabase/beer (create beer review) */
export interface CreateBeerReviewInput {
  untappdId: number;
  name: string;
  brewery: string | null;
  style: string | null;
  abv: number | null;
  ibu: number | null;
  untappdRating: number | null;
  userRating: number;
  link: string | null;
  mainImage: string | null;
  description: string | null;
  comment: string | null;
  location: string | null;
  photos: string[] | null;
  flavorProfiles: number[];
  presentationStyle: number;
}

/** Item from GET /api/supabase/beer/my-all-ratings */
export interface MyRatingListItem {
  id: number;
  untappdId?: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  userRating: number;
  mainImage: string;
  images: string[];
  description: string;
  presentationStyle: number;
  photos?: string[] | null;
  untappdRating: number | null;
}

