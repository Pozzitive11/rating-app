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
export type CreateBeerReviewInput = {
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
};

export const createBeerReviewSchema: z.ZodType<CreateBeerReviewInput> =
  z.object({
    untappdId: z.number(),
    name: z.string().min(1, "Beer name is required").trim(),
    brewery: z.string().nullable(),
    style: z.string().nullable(),
    abv: z.number().nullable(),
    ibu: z.number().nullable(),
    untappdRating: z
      .number()
      .min(0.25, "Rating must be at least 0.25")
      .max(5, "Rating must be at most 5")
      .nullable(),
    userRating: z.number(),
    link: z.string().url().nullable(),
    mainImage: z.string().url().nullable(),
    description: z.string().nullable(),
    comment: z.string().nullable(),
    location: z.string().nullable(),
    photos: z.array(z.string().url()).nullable(),
    flavorProfiles: z.array(z.number()),
    presentationStyle: z.number(),
  });


export type SearchQuery = z.infer<typeof searchQuerySchema>;
