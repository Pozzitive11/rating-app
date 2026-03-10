import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseConfig, config } from "../config";
import {
  BeerReview,
  BeerReviewInsert,
  BeerReviewFlavorProfileInsert,
  FlavorProfile,
  PresentationStyle,
  Database,
} from "../types";
import { DatabaseError } from "../middleware/errorHandler";

type TypedSupabaseClient = SupabaseClient<Database>;

let supabase: TypedSupabaseClient | null = null;

export const getSupabaseClient = (): TypedSupabaseClient => {
  assertSupabaseConfig();
  if (!supabase) {
    supabase = createClient<Database>(
      config.SUPABASE_URL!,
      config.SUPABASE_KEY!
    );
  }
  return supabase;
};

// Helper function to create an authenticated Supabase client
// This creates a client that uses the access token for RLS policies
export const createAuthenticatedClient = (
  accessToken: string
): TypedSupabaseClient => {
  assertSupabaseConfig();
  const client = createClient<Database>(
    config.SUPABASE_URL!,
    config.SUPABASE_KEY!,
    {
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
    }
  );
  return client;
};

// Helper function to get the appropriate client (DRY principle)
const getClient = (accessToken?: string): TypedSupabaseClient => {
  return accessToken ? createAuthenticatedClient(accessToken) : getSupabaseClient();
};

// Helper functions for common operations
const supabaseHelpers = {
  getMyBeerRating: async (
    untappdBeerId: number,
    userId: string
  ): Promise<Pick<BeerReview, "user_rating" | "created_at"> | null> => {
    const { data, error } = await getSupabaseClient()
      .from("beer_reviews")
      .select("user_rating, created_at")
      .eq("untappd_id", untappdBeerId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new DatabaseError(error.message);
    return data ?? null;
  },
  getMyAllRatings: async (userId: string): Promise<BeerReview[]> => {
    const { data, error } = await getSupabaseClient()
      .from("beer_reviews")
      .select("*")
      .eq("user_id", userId);
    if (error) throw new DatabaseError(error.message);
    return data || [];
  },

  getCommunityRating: async (
    untappdBeerId: number
  ): Promise<{
    communityRating: number | null;
    communityNumberOfRatings: number;
  }> => {
    const { data, error } = await getSupabaseClient()
      .from("beer_reviews")
      .select("user_rating")
      .eq("untappd_id", untappdBeerId);

    if (error) throw new DatabaseError(error.message);
    if (!data || data.length === 0) {
      return { communityRating: null, communityNumberOfRatings: 0 };
    }

    const total = data.reduce((sum, row) => sum + (row?.user_rating || 0), 0);
    return {
      communityRating: total / data.length,
      communityNumberOfRatings: data.length,
    };
  },

  getBeerById: async (id: number): Promise<BeerReview | null> => {
    const { data, error } = await getSupabaseClient()
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
      .upsert(ratingData, {
        onConflict: "user_id,untappd_id",
      })
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

    const entries: BeerReviewFlavorProfileInsert[] = uniqueIds.map((fpId) => ({
      beer_review_id: beerReviewId,
      flavor_profile_id: fpId,
    }));

    const client = getClient(accessToken);

    await client
      .from("beer_review_flavor_profiles")
      .delete()
      .eq("beer_review_id", beerReviewId);

    const { error } = await client
      .from("beer_review_flavor_profiles")
      .insert(entries);

    if (error) {
      throw new DatabaseError(
        `Failed to save beer review flavor profiles: ${error.message || "Unknown error"
        }`
      );
    }
  },

  getFlavorProfiles: async (): Promise<FlavorProfile[]> => {
    const { data, error } = await getSupabaseClient()
      .from("flavor_profiles")
      .select("*");

    if (error) {
      throw new DatabaseError(
        `Failed to get flavor profiles: ${error.message || "Unknown error"}`
      );
    }

    return data || [];
  },

  getPresentationStyles: async (): Promise<PresentationStyle[]> => {
    const { data, error } = await getSupabaseClient()
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

export { supabaseHelpers };
