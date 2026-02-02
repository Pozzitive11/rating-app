alter table if exists beer_reviews
  add column if not exists community_rating numeric,
  add column if not exists community_number_of_ratings integer;
