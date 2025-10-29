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
  async saveBeer(ratingData: BeerReviewInsert): Promise<BeerReview> {
    const { data, error } = await supabase
      .from("beer_reviews")
      .insert(ratingData)
      .select();

    if (error) throw error;
    return data[0];
  },

  async saveBeerReviewFlavorProfiles(
    beerReviewId: number,
    flavorProfileIds: number[]
  ): Promise<void> {
    if (flavorProfileIds.length === 0) return;

    const entries = flavorProfileIds.map((fpId) => ({
      beer_review_id: beerReviewId,
      flavor_profile_id: fpId,
    }));

    const { error } = await supabase
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
