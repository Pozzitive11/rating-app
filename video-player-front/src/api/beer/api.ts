import type {
  FlavorProfile,
  PresentationStyle,
} from "../types";

const API_BASE_URL = "http://localhost:5000/api";

export interface Beer {
  id: string;
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
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Get all beers
export const getBeers = async (
  name?: string
): Promise<Beer[]> => {
  const response = await fetch(
    `${API_BASE_URL}/beers?name=${name}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data.beers || [];
};

// Get specific beer
export const getBeerById = async (
  id: number
): Promise<Beer> => {
  const response = await fetch(
    `${API_BASE_URL}/supabase/beer/${id}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data;
};

// Upload beer
export const uploadBeer = async (
  beer: Beer
): Promise<Beer> => {
  const response = await fetch(
    `${API_BASE_URL}/supabase/beer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(beer),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const data = await response.json();
  return data.review;
};

// Search beers by query
export const searchUntappdBeers = async (
  query: string
): Promise<Beer[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/untappd/search/${encodeURIComponent(query.trim())}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data || [];
};

// Get a beer from Untappd
export const getUntappdBeerDetailsById = async (
  id: string
): Promise<Beer> => {
  const response = await fetch(
    `${API_BASE_URL}/untappd/beer/${id}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data;
};

// Get all flavor profiles
export const getFlavorProfiles = async (): Promise<
  FlavorProfile[]
> => {
  const response = await fetch(
    `${API_BASE_URL}/supabase/flavor-profiles`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data;
};
// Get all presentation styles
export const getPresentationStyles = async (): Promise<
  PresentationStyle[]
> => {
  const response = await fetch(
    `${API_BASE_URL}/supabase/presentation-styles`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  return data;
};
