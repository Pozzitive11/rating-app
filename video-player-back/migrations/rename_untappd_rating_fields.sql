alter table if exists beer_reviews
  rename column rating to untappd_rating;

alter table if exists beer_reviews
  rename column number_of_ratings to untappd_number_of_ratings;
