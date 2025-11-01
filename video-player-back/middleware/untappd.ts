import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { OriginalBeer } from "../types";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

/**
 * Utility function to extract beer data from a Cheerio element
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
    "https://untappd.com" + ($el.find("a").attr("href") || "").trim();

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

export async function fetchUntappdBeers(
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
      const beerData = extractBeerData($, $(el));
      beers.push(beerData);
    });

    return Promise.resolve(beers);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, (error as Error).message);
    return Promise.reject(error);
  }
}

export async function fetchUntappdBeerDetailsById(
  beerId: number
): Promise<OriginalBeer> {
  const url = `https://untappd.com/beer/${beerId}`;
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const beer = extractBeerData($, "body", { link: url, beerId });

    const description = $(".beer-descrption-read-less").text().trim() || null;
    const ratersText = $(".raters").text().trim() || "0";
    const numberOfRatings = parseInt(ratersText.replace(/[^\d]/g, "")) || 0;
    return Promise.resolve({ ...beer, numberOfRatings, description });
  } catch (error) {
    console.error(
      `Error fetching beer details ${beerId}:`,
      (error as Error).message
    );
    return Promise.reject(error);
  }
}
