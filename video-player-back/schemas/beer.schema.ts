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
  untappdId?: number | null | undefined;
  name: string;
  brewery?: string | undefined;
  style?: string | null | undefined;
  abv?: number | null | undefined;
  ibu?: number | null | undefined;
  rating: number;
  link?: string | null | undefined;
  mainImage?: string | null | undefined;
  description?: string | null | undefined;
  comment?: string | null | undefined;
  location?: string | null | undefined;
  photos?: string[] | null | undefined;
  flavorProfiles?: number[] | undefined;
  presentationStyle?: number | null | undefined;
};

export const createBeerReviewSchema: z.ZodType<CreateBeerReviewInput> =
  z.object({
    untappdId: z.number().nullable().optional(),
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
export type SearchQuery = z.infer<typeof searchQuerySchema>;
