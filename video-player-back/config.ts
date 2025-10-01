export const config = {
  // Server Configuration
  PORT: parseInt(process.env["PORT"] || "5000"),
  NODE_ENV: process.env["NODE_ENV"] || "development",

  // CORS Configuration
  CORS_ORIGIN: process.env["CORS_ORIGIN"],

  // Supabase Configuration
  SUPABASE_URL: process.env["SUPABASE_URL"],
  SUPABASE_KEY: process.env["SUPABASE_KEY"],

  // API Configuration
  API_BASE_URL: process.env["API_BASE_URL"] || "/api",
};
