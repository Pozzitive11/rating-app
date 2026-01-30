import express from "express";
import {
  createBeerReview,
  getBeerById,
  getFlavorProfiles,
  getMyBeerRating,
  getMyAllRatings,
  getPresentationStyles,
} from "../controllers/beer.controllers";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// POST /api/supabase/beer - Create a new beer review
router.post("/beer", authenticate, createBeerReview);

// GET /api/supabase/beer/:untappdBeerId/my-rating - Get my beer rating
router.get("/beer/:untappdBeerId/my-rating", authenticate, getMyBeerRating);

// GET /api/supabase/beer/my-all-ratings - Get all beer ratings by user ID
router.get("/beer/my-all-ratings", authenticate, getMyAllRatings);

// GET /api/supabase/beer/:id - Get a beer review by id
router.get("/beer/:id", getBeerById);

// GET /api/supabase/flavor-profiles - Get all flavor profiles
router.get("/flavor-profiles", getFlavorProfiles);

// GET /api/supabase/presentation-styles - Get all presentation styles
router.get("/presentation-styles", getPresentationStyles);

export default router;
