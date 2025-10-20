import { z } from "zod";

/**
 * Schema for beer search query parameter validation
 */
export const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").trim(),
});

/**
 * Schema for creating a beer review (API format - camelCase)
 * This validates incoming request data before mapping to DB format
 */
export const createBeerReviewSchema = z.object({
  name: z.string().min(1, "Beer name is required").trim(),
  brewery: z.string().optional(),
  style: z.string().nullable().optional(),
  abv: z.number().nullable().optional(),
  ibu: z.number().nullable().optional(),
  rating: z
    .number()
    .min(0.25, "Rating must be at least 0.25")
    .max(5, "Rating must be at most 5"),
  link: z.url().nullable().optional(),
  mainImage: z.url().nullable().optional(),
  description: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  photos: z.array(z.url()).nullable().optional(),
  flavorProfiles: z.array(z.number()).optional(),
  presentationStyle: z.number().nullable().optional(),
});

// Type inference from schema
export type CreateBeerReviewInput = z.infer<typeof createBeerReviewSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
