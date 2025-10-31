import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { OriginalBeer } from "../types";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

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
      const beerId = link.split("/").pop() || uuidv4();

      beers.push({
        id: beerId,
        name,
        brewery,
        style,
        rating,
        link,
        mainImage,
        abv,
        ibu,
      });
    });

    return Promise.resolve(beers);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, (error as Error).message);
    return Promise.reject(error);
  }
}

export async function fetchUntappdBeerDetailsById(
  beerId: string
): Promise<OriginalBeer> {
  const url = `https://untappd.com/beer/${beerId}`;
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const beer: OriginalBeer = {
      id: beerId,
      name: $().find(".beer-name").text().trim(),
      brewery: $().find(".brewery-name").text().trim(),
      style: $().find(".beer-style").text().trim(),
      abv: parseFloat($().find(".beer-abv").text().trim()),
      ibu: parseFloat($().find(".beer-ibu").text().trim()),
      rating: parseFloat($().find(".beer-rating").text().trim()),
      mainImage: $().find(".beer-image").attr("src") || null,
      link: url,
      description: $().find(".beer-description").text().trim(),
    };
    return Promise.resolve(beer);
  } catch (error) {
    console.error(
      `Error fetching beer details ${beerId}:`,
      (error as Error).message
    );
    return Promise.reject(error);
  }
}
