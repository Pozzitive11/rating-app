-- ✅ COMPLETED
-- -- Migration: Add auth_user_id to users table
-- -- Run this in your Supabase SQL Editor

-- -- Add auth_user_id column to users table
-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- -- Create index for faster lookups
-- CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- -- Make it unique (one auth user = one profile)
-- ALTER TABLE users 
-- ADD CONSTRAINT users_auth_user_id_unique UNIQUE (auth_user_id);

-- -- Make it NOT NULL after backfilling existing data (if any)
-- -- First, update any existing rows if needed:
-- -- UPDATE users SET auth_user_id = (SELECT id FROM auth.users WHERE email = users.email LIMIT 1);
-- -- Then uncomment the line below:
-- -- ALTER TABLE users ALTER COLUMN auth_user_id SET NOT NULL;

-- -- Optional: Add a comment
-- COMMENT ON COLUMN users.auth_user_id IS 'References auth.users.id (UUID from Supabase Auth)';
