const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
};

async function fetchBeers(query, page = 1) {
  const url = `https://untappd.com/search?q=${encodeURIComponent(query)}&type=beer&page=${page}`;
  
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const beers = [];

    $('div.beer-item').each((i, el) => {
      const name = $(el).find('.name').find('a').text().trim();
      const brewery = $(el).find('.brewery').find('a').text().trim();
      const style = $(el).find('.style').text().trim();
      const ratingText = $(el).find('.num').first().text().trim() || 'N/A';
      const rating = +ratingText.replace(/[()]/g, ''); // Remove parentheses from rating
      const link = 'https://untappd.com' + ($(el).find('a').attr('href') || '').trim();
      const mainImage = $(el).find('.label').find('img').attr('src') || '';
      const abv = $(el).find('.abv').text().trim() || 'N/A';
      const ibu = $(el).find('.ibu').text().trim() || 'N/A';
      const description = $(el).find('.beer-description').text().trim() || 'N/A';
      beers.push({ id: uuidv4(), name, brewery, style, rating, link, mainImage, abv, ibu, description });
    });

    return beers;
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error.message);
    return [];
  }
}

async function scrapeUntappd(query, totalPages = 1) {
  const allBeers = [];

  for (let i = 1; i <= totalPages; i++) {
    // console.log(`📄 Fetching page ${i} for query: "${query}"`);
    const beers = await fetchBeers(query, i);
    allBeers.push(...beers);
    await new Promise(res => setTimeout(res, 1500));
  }

  // console.log(`\n✅ Found ${allBeers.length} beers for "${query}"\n`);
  
  return allBeers;
}

// Export functions for use in other modules
module.exports = {
  fetchBeers,
  scrapeUntappd
};
