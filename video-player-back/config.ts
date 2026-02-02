import dotenv from "dotenv";
import { z } from "zod";

// Ensure environment variables are loaded before parsing
dotenv.config();

// Environment variables schema
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().optional(),
  CORS_ORIGINS: z.string().optional(), // Comma-separated list of origins
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL").optional(),
  SUPABASE_KEY: z.string().min(1, "SUPABASE_KEY is required").optional(),
  API_BASE_URL: z.string().default("/api"),
  REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(30000), // 30 seconds default
});

// Parse and validate environment variables
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    PORT: process.env["PORT"],
    NODE_ENV: process.env["NODE_ENV"],
    CORS_ORIGIN: process.env["CORS_ORIGIN"],
    CORS_ORIGINS: process.env["CORS_ORIGINS"],
    SUPABASE_URL: process.env["SUPABASE_URL"],
    SUPABASE_KEY: process.env["SUPABASE_KEY"],
    API_BASE_URL: process.env["API_BASE_URL"],
    REQUEST_TIMEOUT_MS: process.env["REQUEST_TIMEOUT_MS"],
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

const validatedEnv = parseEnv();

// Fail fast in production when CORS is not configured
if (
  validatedEnv.NODE_ENV !== "development" &&
  !validatedEnv.CORS_ORIGIN &&
  !validatedEnv.CORS_ORIGINS
) {
  throw new Error("CORS_ORIGIN or CORS_ORIGINS must be set in production");
}

// Parse CORS origins from environment variable or use defaults for development
const getCorsOrigins = (): string[] => {
  if (validatedEnv.CORS_ORIGINS) {
    return validatedEnv.CORS_ORIGINS.split(",").map((origin) => origin.trim());
  }

  if (validatedEnv.CORS_ORIGIN) {
    return [validatedEnv.CORS_ORIGIN];
  }

  // Default origins for development
  if (validatedEnv.NODE_ENV === "development") {
    return [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ];
  }

  return [];
};

export const config = {
  // Server Configuration
  PORT: validatedEnv.PORT,
  NODE_ENV: validatedEnv.NODE_ENV,

  // CORS Configuration
  CORS_ORIGINS: getCorsOrigins(),

  // Supabase Configuration
  SUPABASE_URL: validatedEnv.SUPABASE_URL,
  SUPABASE_KEY: validatedEnv.SUPABASE_KEY,

  // API Configuration
  API_BASE_URL: validatedEnv.API_BASE_URL,

  // Request Timeout Configuration
  REQUEST_TIMEOUT_MS: validatedEnv.REQUEST_TIMEOUT_MS,
};

export const assertSupabaseConfig = (): void => {
  if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    throw new Error(
      "Missing Supabase configuration. SUPABASE_URL and SUPABASE_KEY must be set."
    );
  }
};
