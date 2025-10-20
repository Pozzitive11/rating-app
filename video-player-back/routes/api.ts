import express from "express";
import { searchBeers } from "../controllers/beer.controlles";

const router = express.Router();

// GET /api/beers/search/:query - Search for beers from Untappd
router.get("/beers/search/:query", searchBeers);

export default router;
