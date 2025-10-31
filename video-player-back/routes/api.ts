import express from "express";
import {
  getUntappdBeerDetailsById,
  searchUntappdBeers,
} from "../controllers/beer.controlles";

const router = express.Router();

// GET /api/untappd/search/:query - Search for beers from Untappd
router.get("/untappd/search/:query", searchUntappdBeers);

// GET /api/untappd/beer/:id - Get a beer from Untappd
router.get("/untappd/beer/:id", getUntappdBeerDetailsById);

export default router;
