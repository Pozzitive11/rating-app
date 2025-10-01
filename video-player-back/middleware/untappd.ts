import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { OriginalBeer } from "../types";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

/**
 * Parses beer description from HTML with Show More/Show Less functionality
 * Extracts the full description text from the beer-descrption-read-less block
 */
function parseBeerDescription(
  $: cheerio.CheerioAPI,
  element: cheerio.Cheerio<any>
): string | null {
  // Debug: Log the HTML structure to see what we're working with
  // First try to get the full description from beer-descrption-read-less block
  const readLessElement = element.find(".beer-descrption-read-more");
  console.log("readLessElement:", readLessElement.text());

  if (readLessElement.length > 0) {
    // Clone to avoid modifying the original DOM
    const descClone = readLessElement.clone();

    // Remove the "Show Less" link
    descClone.find("a.read-less").remove();

    // Get text content and clean up
    let description = descClone.text().trim();

    // Replace multiple whitespace with single space
    description = description.replace(/\s+/g, " ");

    if (description) {
      return description;
    }
  }

  // Fallback: try to get from beer-descrption-read-more block
  const readMoreElement = element.find(".beer-descrption-read-more");

  if (readMoreElement.length > 0) {
    const readMoreClone = readMoreElement.clone();

    // Remove the "Show More" link
    readMoreClone.find("a.read-more").remove();

    let description = readMoreClone.text().trim();
    description = description.replace(/\s+/g, " ");

    if (description) {
      return description;
    }
  }

  return null;
}

export async function fetchBeers(
  query: string,
  page: number = 1
): Promise<OriginalBeer[]> {
  const url = `https://untappd.com/search?q=${encodeURIComponent(
    query
  )}&type=beer&page=${page}`;

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const beers: OriginalBeer[] = [];

    $("div.beer-item").each((i, el) => {
      const name = $(el).find(".name").find("a").text().trim();
      const brewery = $(el).find(".brewery").find("a").text().trim();
      const style = $(el).find(".style").text().trim();
      const ratingText = $(el).find(".num").first().text().trim() || null;
      const rating = ratingText ? +ratingText.replace(/[()]/g, "") : null; // Remove parentheses from rating
      const link =
        "https://untappd.com" + ($(el).find("a").attr("href") || "").trim();
      const mainImage = $(el).find(".label").find("img").attr("src") || null;
      const abvText = $(el).find(".abv").text().trim();
      const abv = abvText ? parseFloat(abvText) : null;
      const ibuText = $(el).find(".ibu").text().trim();
      const ibu = ibuText ? parseFloat(ibuText) : null;
      const description = parseBeerDescription($, $(el));

      beers.push({
        name,
        brewery,
        style,
        rating,
        link,
        mainImage,
        abv,
        ibu,
        description,
      });
    });

    return Promise.resolve(beers);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, (error as Error).message);
    return Promise.reject(error);
  }
}
