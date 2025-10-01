import express, { Request, Response } from "express";
import { supabaseHelpers } from "../models/supabase";
import { BeerReviewInsert } from "../types";

const router = express.Router();

router.post("/beer", async (req: Request, res: Response) => {
  try {
    const {
      name,
      brewery,
      style,
      abv,
      ibu,
      rating,
      link,
      mainImage,
      description,
      flavorProfiles,
      presentationStyle,
      location,
      comment,
      photos,
    } = req.body;

    if (!name || rating === null) {
      return res.status(400).json({
        error: "Missing required fields: name and rating are required",
      });
    }

    const reviewData: BeerReviewInsert = {
      beer_name: name,
      brewery: brewery,
      style: style,
      rating: rating,
      abv: abv,
      ibu: ibu,
      link: link,
      main_image: mainImage,
      description: description,
      comment: comment,
      location: location,
      photos: photos,
      presentation_style: presentationStyle,
      created_at: new Date().toISOString(),
    };

    const savedReview = await supabaseHelpers.saveBeer(reviewData);

    if (flavorProfiles) {
      await supabaseHelpers.saveBeerReviewFlavorProfiles(
        savedReview.id,
        flavorProfiles
      );
    }

    return res.status(201).json(savedReview.id);
  } catch (error) {
    console.error("Error saving beer rating to Supabase:", error);
    return res.status(500).json({
      error: `Failed to save beer rating to Supabase: ${error}`,
    });
  }
});

router.get("/flavor-profiles", async (req: Request, res: Response) => {
  try {
    const flavorProfiles = await supabaseHelpers.getFlavorProfiles();
    return res.json(flavorProfiles);
  } catch (error) {
    console.error("Error fetching flavor profiles from Supabase:", error);
    return res.status(500).json({
      error: `Failed to fetch flavor profiles from Supabase: ${error}`,
    });
  }
});

router.get("/presentation-styles", async (req: Request, res: Response) => {
  try {
    const presentationStyles = await supabaseHelpers.getPresentationStyles();
    return res.json(presentationStyles);
  } catch (error) {
    console.error("Error fetching presentation styles from Supabase:", error);
    return res.status(500).json({
      error: `Failed to fetch presentation styles from Supabase: ${error}`,
    });
  }
});

export default router;
