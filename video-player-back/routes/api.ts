import express, { Request, Response } from "express";
import { fetchBeers } from "../middleware/untappd";

const router = express.Router();

router.get(
  "/beers/search/:query",
  async (req: Request<{ query: string }>, res: Response): Promise<Response> => {
    try {
      const { query } = req.params;
      const beers = await fetchBeers(query);

      if (beers.length === 0) {
        return res.status(404).json({ error: "No beers found" });
      }

      return res.json(beers);
    } catch (error) {
      console.error("Error searching beers:", error);
      return res.status(500).json({
        error: `Failed to search beers: ${error}`,
      });
    }
  }
);

export default router;
