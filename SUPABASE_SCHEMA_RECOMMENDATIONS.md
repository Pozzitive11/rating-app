# Supabase Schema Recommendations for Auth Relations

## Current Setup Analysis

✅ **What's working:**

- `beer_reviews.user_id` stores `auth.users.id` (UUID) directly
- Using authenticated clients for RLS policies

⚠️ **What needs fixing:**

- `users` table missing `auth_user_id` field
- No foreign key constraint (this is OK - Supabase doesn't allow FK to `auth.users`)

## Recommended Database Schema

### 1. Update `users` table

```sql
-- Add auth_user_id column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID NOT NULL UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Optional: Add constraint to ensure uniqueness
-- (already handled by UNIQUE above, but good to be explicit)
```

### 2. Update `beer_reviews` table

```sql
-- Ensure user_id is UUID type (should already be)
-- No foreign key needed - Supabase doesn't allow FK to auth.users
-- RLS policies will handle security
```

### 3. Row Level Security (RLS) Policies

Enable RLS and create policies in Supabase Dashboard:

**For `beer_reviews` table:**

```sql
-- Enable RLS
ALTER TABLE beer_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own reviews
CREATE POLICY "Users can insert their own reviews"
ON beer_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view all reviews (or only their own)
CREATE POLICY "Users can view all reviews"
ON beer_reviews FOR SELECT
USING (true);  -- Change to (auth.uid() = user_id) if you want private reviews

-- Policy: Users can update only their own reviews
CREATE POLICY "Users can update their own reviews"
ON beer_reviews FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own reviews
CREATE POLICY "Users can delete their own reviews"
ON beer_reviews FOR DELETE
USING (auth.uid() = user_id);
```

**For `beer_review_flavor_profiles` table:**

```sql
-- Enable RLS
ALTER TABLE beer_review_flavor_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert flavor profiles for their own reviews
CREATE POLICY "Users can insert flavor profiles for their own reviews"
ON beer_review_flavor_profiles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM beer_reviews
    WHERE beer_reviews.id = beer_review_flavor_profiles.beer_review_id
    AND beer_reviews.user_id = auth.uid()
  )
);

-- Policy: Users can view flavor profiles for all reviews (or only their own)
CREATE POLICY "Users can view flavor profiles"
ON beer_review_flavor_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM beer_reviews
    WHERE beer_reviews.id = beer_review_flavor_profiles.beer_review_id
    AND beer_reviews.user_id = auth.uid()  -- Change to remove this line if you want all users to see all flavor profiles
  )
);
-- Alternative: If you want everyone to see all flavor profiles, use:
-- USING (true);

-- Policy: Users can update flavor profiles for their own reviews
CREATE POLICY "Users can update flavor profiles for their own reviews"
ON beer_review_flavor_profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM beer_reviews
    WHERE beer_reviews.id = beer_review_flavor_profiles.beer_review_id
    AND beer_reviews.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM beer_reviews
    WHERE beer_reviews.id = beer_review_flavor_profiles.beer_review_id
    AND beer_reviews.user_id = auth.uid()
  )
);

-- Policy: Users can delete flavor profiles for their own reviews
CREATE POLICY "Users can delete flavor profiles for their own reviews"
ON beer_review_flavor_profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM beer_reviews
    WHERE beer_reviews.id = beer_review_flavor_profiles.beer_review_id
    AND beer_reviews.user_id = auth.uid()
  )
);
```

**For `users` table:**

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (or only their own)
CREATE POLICY "Users can view profiles"
ON users FOR SELECT
USING (true);  -- Change to (auth.uid() = auth_user_id) for private profiles

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);
```

### 4. Database Trigger (Recommended)

Automatically create a `users` record when a new auth user is created:

```sql
-- Function to create user profile
-- Uses ON CONFLICT to handle cases where user might already exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (email, username, auth_user_id, created_at)
  VALUES (
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.id,
    NOW()
  )
  ON CONFLICT (auth_user_id) DO NOTHING;  -- Prevents duplicate key errors
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Important Notes:**

- The trigger runs automatically when a user signs up via Supabase Auth
- If the trigger fails, the auth.users insert will also fail (they're in the same transaction)
- The `ON CONFLICT DO NOTHING` prevents errors if the user already exists
- **After adding this trigger, remove the manual user insert from your code** (see `auth.service.ts`)

## Architecture Decision

### Option A: Direct Reference (Current - Recommended)

```
auth.users (Supabase managed)
    ↓ (no FK, just UUID reference)
beer_reviews.user_id (UUID)
```

**Pros:**

- Simpler
- No extra joins needed
- Works directly with RLS
- Standard Supabase pattern

**Cons:**

- Can't enforce referential integrity at DB level
- Need to handle orphaned records manually

### Option B: Custom Users Table as Intermediary

```
auth.users (Supabase managed)
    ↓ (no FK, just UUID reference)
users.auth_user_id (UUID)
    ↓ (FK)
beer_reviews.user_id → users.id (integer)
```

**Pros:**

- Can enforce referential integrity for `beer_reviews → users`
- Cleaner separation of concerns

**Cons:**

- More complex
- Extra join needed
- Still can't FK to `auth.users`

## Recommendation

**Stick with Option A (Direct Reference)** because:

1. You're already using it
2. It's the Supabase best practice
3. RLS policies provide security
4. Simpler queries

Just add the `auth_user_id` to `users` table for profile management, but keep `beer_reviews.user_id` pointing directly to `auth.users.id`.
