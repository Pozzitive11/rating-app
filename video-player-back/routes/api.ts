import express from "express";
import {
  getBeerDetailsById,
  searchUntappdBeers,
  getMyBeerRating,
  getRandomBeers,
} from "../controllers/beer.controllers";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// GET /api/untappd/search/:query - Search for beers from Untappd
router.get("/untappd/search/:query", searchUntappdBeers);

// GET /api/untappd/random - Get 5 random beers
router.get("/untappd/random", getRandomBeers);

// GET /api/untappd/beer/:id - Beer details (legacy alias)
router.get("/untappd/beer/:id", getBeerDetailsById);

// GET /api/beer/:id/details - Beer details (Untappd + community), cacheable, no auth
router.get("/beer/:id/details", getBeerDetailsById);

// GET /api/beer/:id/my-rating - Current user's rating for this beer, auth required
router.get("/beer/:id/my-rating", authenticate, getMyBeerRating);

export default router;
