import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";
import {
  BeerReview,
  BeerReviewInsert,
  FlavorProfile,
  PresentationStyle,
} from "../types";
import { DatabaseError } from "../middleware/errorHandler";

// Validate Supabase configuration
if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
  throw new Error(
    "Missing Supabase configuration. SUPABASE_URL and SUPABASE_KEY must be set."
  );
}

// Create Supabase client for general use (with anon key)
const supabase: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_KEY
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
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
};

// Helper function to get the appropriate client (DRY principle)
const getClient = (accessToken?: string): SupabaseClient => {
  return accessToken ? createAuthenticatedClient(accessToken) : supabase;
};

// Helper functions for common operations
const supabaseHelpers = {
  getBeerById: async (id: number): Promise<BeerReview | null> => {
    const { data, error } = await supabase
      .from("beer_reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(
        `Failed to get beer by id: ${error.message || "Unknown error"}`
      );
    }

    return data;
  },

  // Beer ratings operations
  async saveBeer(
    ratingData: BeerReviewInsert,
    accessToken?: string
  ): Promise<BeerReview> {
    const client = getClient(accessToken);

    const { data, error } = await client
      .from("beer_reviews")
      .insert(ratingData)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(
        `Failed to save beer: ${error.message || "Unknown error"}`
      );
    }

    if (!data) {
      throw new DatabaseError("Insert operation returned no data");
    }

    return data;
  },

  async saveBeerReviewFlavorProfiles(
    beerReviewId: number,
    flavorProfileIds: ReadonlyArray<number>,
    accessToken?: string
  ): Promise<void> {
    // Deduplicate flavor profile IDs
    const uniqueIds = [...new Set(flavorProfileIds)];
    if (uniqueIds.length === 0) return;

    const entries = uniqueIds.map((fpId) => ({
      beer_review_id: beerReviewId,
      flavor_profile_id: fpId,
    }));

    const client = getClient(accessToken);

    const { error } = await client
      .from("beer_review_flavor_profiles")
      .upsert(entries, { ignoreDuplicates: true });

    if (error) {
      throw new DatabaseError(
        `Failed to save beer review flavor profiles: ${
          error.message || "Unknown error"
        }`
      );
    }
  },

  getFlavorProfiles: async (): Promise<FlavorProfile[]> => {
    const { data, error } = await supabase.from("flavor_profiles").select("*");

    if (error) {
      throw new DatabaseError(
        `Failed to get flavor profiles: ${error.message || "Unknown error"}`
      );
    }

    return data || [];
  },

  getPresentationStyles: async (): Promise<PresentationStyle[]> => {
    const { data, error } = await supabase
      .from("presentation_styles")
      .select("*");

    if (error) {
      throw new DatabaseError(
        `Failed to get presentation styles: ${error.message || "Unknown error"}`
      );
    }

    return data || [];
  },
};

export { supabase, supabaseHelpers };
