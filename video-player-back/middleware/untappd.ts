import axios from "axios";
import * as cheerio from "cheerio";
import { OriginalBeer } from "../types";
import {
  sanitizeSearchQuery,
  sanitizeBeerId,
  sanitizePageNumber,
  sanitizeUrl,
} from "../utils/sanitize.utils";
import { config } from "../config";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

const UNTAPPD_BASE_URL = "https://untappd.com";
const UNTAPPD_DOMAIN = "untappd.com";

// Configure axios with timeout
const axiosInstance = axios.create({
  timeout: config.REQUEST_TIMEOUT_MS,
  headers,
});

/**
 * Extract beer data from a Cheerio element
 * @param $ - The Cheerio API
 * @param el - The Cheerio element
 * @param options - The options
 * @returns The beer data
 */
function extractBeerData(
  $: cheerio.CheerioAPI,
  el: cheerio.Cheerio<any> | string,
  options?: { link?: string; beerId?: number }
): OriginalBeer {
  const $el = typeof el === "string" ? $(el) : el;

  const name =
    $el.find(".name").find("a").text().trim() ||
    $el.find(".name").text().trim();
  const brewery =
    $el.find(".brewery").find("a").text().trim() ||
    $el.find(".brewery").text().trim();

  const style = $el.find(".style").text().trim();

  const ratingText = $el.find(".num").first().text().trim() || null;
  const rating = ratingText ? +ratingText.replace(/[()]/g, "") : null;

  const link =
    options?.link ||
    UNTAPPD_BASE_URL + ($el.find("a").attr("href") || "").trim();

  const mainImage = $el.find(".label").find("img").attr("src") || null;

  const abvText = $el.find(".abv").text().trim();
  const abv = abvText ? parseFloat(abvText) : null;

  const ibuText = $el.find(".ibu").text().trim();
  const ibu = ibuText ? parseFloat(ibuText) : null;

  const beerId = parseInt(link.split("/").pop() || "0");

  return {
    id: beerId,
    name,
    brewery,
    style,
    rating,
    link,
    mainImage,
    abv,
    ibu,
  };
}

/**
 * Fetch beers from Untappd
 * @param query - The search query
 * @param page - The page number
 * @returns The beers
 */
export async function fetchUntappdBeers(
  query: string,
  page: number = 1
): Promise<OriginalBeer[]> {
  // Sanitize inputs
  const sanitizedQuery = sanitizeSearchQuery(query);
  const sanitizedPage = sanitizePageNumber(page);

  const url = `${UNTAPPD_BASE_URL}/search?q=${encodeURIComponent(
    sanitizedQuery
  )}&type=beer&page=${sanitizedPage}`;

  // Validate URL before making request
  sanitizeUrl(url, UNTAPPD_DOMAIN);

  try {
    const response = await axiosInstance.get(url);
    const $ = cheerio.load(response.data);
    const beers: OriginalBeer[] = [];

    $("div.beer-item").each((i, el) => {
      const beerData = extractBeerData($, $(el));
      beers.push(beerData);
    });

    return Promise.resolve(beers);
  } catch (error) {
    console.error(
      `Error fetching page ${sanitizedPage}:`,
      (error as Error).message
    );
    return Promise.reject(error);
  }
}

/**
 * Fetch beer details from Untappd
 * @param beerId - The beer ID
 * @returns The beer details
 */
export async function fetchUntappdBeerDetailsById(
  beerId: number
): Promise<OriginalBeer> {
  // Sanitize beer ID
  const sanitizedId = sanitizeBeerId(beerId);

  const url = `${UNTAPPD_BASE_URL}/beer/${sanitizedId}`;

  // Validate URL before making request
  sanitizeUrl(url, UNTAPPD_DOMAIN);

  try {
    const response = await axiosInstance.get(url);
    const $ = cheerio.load(response.data);
    const beer = extractBeerData($, "body", { link: url, beerId: sanitizedId });

    const description = $(".beer-descrption-read-less").text().trim() || null;
    const ratersText = $(".raters").text().trim() || "0";
    const numberOfRatings = parseInt(ratersText.replace(/[^\d]/g, "")) || 0;
    return Promise.resolve({ ...beer, numberOfRatings, description });
  } catch (error) {
    console.error(
      `Error fetching beer details ${sanitizedId}:`,
      (error as Error).message
    );
    return Promise.reject(error);
  }
}
