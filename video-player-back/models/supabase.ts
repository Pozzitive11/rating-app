import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";
import {
  BeerReview,
  BeerReviewInsert,
  FlavorProfile,
  PresentationStyle,
} from "../types";

// Create Supabase client for general use (with anon key)
const supabase: SupabaseClient = createClient(
  config.SUPABASE_URL!,
  config.SUPABASE_KEY!
);

// Helper function to create an authenticated Supabase client
// This creates a client that uses the access token for RLS policies
export const createAuthenticatedClient = (
  accessToken: string
): SupabaseClient => {
  const client = createClient(config.SUPABASE_URL!, config.SUPABASE_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false, // We're manually managing the token
      autoRefreshToken: false, // We're manually managing the token
      detectSessionInUrl: false,
    },
  });
  return client;
};

// Helper functions for common operations
const supabaseHelpers = {
  getBeerById: async (id: number): Promise<BeerReview> => {
    const { data, error } = await supabase
      .from("beer_reviews")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data[0];
  },
  // Beer ratings operations
  async saveBeer(
    ratingData: BeerReviewInsert,
    accessToken?: string
  ): Promise<BeerReview> {
    // Use authenticated client if token is provided (needed for RLS)
    const client = accessToken
      ? createAuthenticatedClient(accessToken)
      : supabase;

    const { data, error } = await client
      .from("beer_reviews")
      .insert(ratingData)
      .select();

    if (error) throw error;
    return data[0];
  },

  async saveBeerReviewFlavorProfiles(
    beerReviewId: number,
    flavorProfileIds: number[],
    accessToken?: string
  ): Promise<void> {
    if (flavorProfileIds.length === 0) return;

    const entries = flavorProfileIds.map((fpId) => ({
      beer_review_id: beerReviewId,
      flavor_profile_id: fpId,
    }));

    // Use authenticated client if token is provided (needed for RLS)
    const client = accessToken
      ? createAuthenticatedClient(accessToken)
      : supabase;

    const { error } = await client
      .from("beer_review_flavor_profiles")
      .insert(entries);

    if (error) throw error;
  },

  getFlavorProfiles: async (): Promise<FlavorProfile[]> => {
    const { data, error } = await supabase.from("flavor_profiles").select("*");
    if (error) throw error;
    return data;
  },

  getPresentationStyles: async (): Promise<PresentationStyle[]> => {
    const { data, error } = await supabase
      .from("presentation_styles")
      .select("*");
    if (error) throw error;
    return data;
  },
};

export { supabase, supabaseHelpers };
