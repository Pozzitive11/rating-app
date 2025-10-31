import express from "express";
import { searchUntappdBeers } from "../controllers/beer.controlles";

const router = express.Router();

// GET /api/beers/search/:query - Search for beers from Untappd
router.get("/beers/search/:query", searchUntappdBeers);

export default router;
