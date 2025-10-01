import { Tables, TablesInsert } from "./database.types";

export type FlavorProfile = Tables<"flavor_profiles">;
export type PresentationStyle = Tables<"presentation_styles">;
export type BeerReview = Tables<"beer_reviews">;
export type BeerReviewInsert = TablesInsert<"beer_reviews">;
// Beer-related types
export interface OriginalBeer {
  id?: string;
  name: string;
  brewery: string;
  style: string;
  abv: number | null;
  ibu: number | null;
  rating: number | null;
  numberOfRatings?: number;
  mainImage: string | null;
  link: string;
  description?: string | null;
}

export interface RatedBeer {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  link: string;
  userRating?: number;
  numberOfRatings?: number;
  mainImage: string;
  images?: string[];
  description: string;
  glassType?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  summary?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalRatings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RatingStats {
  totalRatings: number;
  averageRating: number;
  dataSource?: string;
}

// Supabase types
export interface SupabaseClient {
  from: (table: string) => any;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
  count?: number;
}

export interface SearchBeersRequest {
  query: string;
  page?: number;
}

export interface GetBeerRatingsRequest {
  name: string;
  brewery?: string;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
