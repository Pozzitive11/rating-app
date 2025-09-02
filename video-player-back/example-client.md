# Beer Rating API - Client Usage Examples

## Environment Variables

Create a `.env` file in the `video-player-back` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/beer-rating-app

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### 1. Search for Beers

```javascript
// GET /api/beers/search/:query
const searchBeers = async (query) => {
  const response = await fetch(
    `http://localhost:5000/api/beers/search/${query}`
  );
  const data = await response.json();
  return data.beers;
};
```

### 2. Get Specific Beer by Name

```javascript
// GET /api/beers/name/:name
const getBeerByName = async (name) => {
  const response = await fetch(`http://localhost:5000/api/beers/name/${name}`);
  const data = await response.json();
  return data.beers;
};
```

### 3. Save Beer Rating (NEW)

```javascript
// POST /api/ratings
const saveBeerRating = async (beerData, userRating) => {
  const payload = {
    originalBeer: {
      name: beerData.name,
      brewery: beerData.brewery,
      style: beerData.style,
      abv: beerData.abv,
      ibu: beerData.ibu,
      rating: beerData.rating,
      numberOfRatings: beerData.numberOfRatings,
      image: beerData.image,
      link: beerData.link,
      description: beerData.description,
    },
    userRating: {
      overall: userRating.overall, // Required: 0-5
      aroma: userRating.aroma, // Optional: 0-5
      appearance: userRating.appearance, // Optional: 0-5
      taste: userRating.taste, // Optional: 0-5
      mouthfeel: userRating.mouthfeel, // Optional: 0-5
      notes: userRating.notes, // Optional: text
      flavorProfiles: userRating.flavorProfiles, // Optional: array of strings
      presentationStyle: userRating.presentationStyle, // Optional: string
    },
  };

  const response = await fetch("http://localhost:5000/api/ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": "user-session-123", // Optional: for tracking
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};
```

### 4. Get All Ratings

```javascript
// GET /api/ratings
const getAllRatings = async (page = 1, limit = 10) => {
  const response = await fetch(
    `http://localhost:5000/api/ratings?page=${page}&limit=${limit}`
  );
  return await response.json();
};
```

### 5. Get Ratings for Specific Beer

```javascript
// GET /api/ratings/beer/:name
const getBeerRatings = async (beerName, brewery = null) => {
  let url = `http://localhost:5000/api/ratings/beer/${beerName}`;
  if (brewery) {
    url += `?brewery=${brewery}`;
  }

  const response = await fetch(url);
  return await response.json();
};
```

### 6. Get Rating Statistics

```javascript
// GET /api/ratings/stats
const getRatingStats = async () => {
  const response = await fetch("http://localhost:5000/api/ratings/stats");
  return await response.json();
};
```

## Example Usage in React Component

```jsx
import { useState } from "react";

const BeerRatingComponent = () => {
  const [beer, setBeer] = useState(null);
  const [rating, setRating] = useState({
    overall: 0,
    notes: "",
    flavorProfiles: [],
    presentationStyle: "",
  });

  const searchAndRate = async (searchQuery) => {
    // 1. Search for beer
    const beers = await searchBeers(searchQuery);
    if (beers.length > 0) {
      setBeer(beers[0]);
    }
  };

  const submitRating = async () => {
    if (beer && rating.overall > 0) {
      const result = await saveBeerRating(beer, rating);
      console.log("Rating saved:", result);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a beer..."
        onBlur={(e) => searchAndRate(e.target.value)}
      />

      {beer && (
        <div>
          <h3>
            {beer.name} by {beer.brewery}
          </h3>
          <p>Style: {beer.style}</p>
          <p>ABV: {beer.abv}%</p>

          <div>
            <label>Your Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating.overall}
              onChange={(e) =>
                setRating((prev) => ({
                  ...prev,
                  overall: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label>Notes:</label>
            <textarea
              value={rating.notes}
              onChange={(e) =>
                setRating((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </div>

          <button onClick={submitRating}>Save Rating</button>
        </div>
      )}
    </div>
  );
};

export default BeerRatingComponent;
```

## Data Models

### Beer Object (from Untappd)

```typescript
interface Beer {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  numberOfRatings: number;
  image: string;
  link: string;
  description: string;
}
```

### User Rating Object

```typescript
interface UserRating {
  overall: number; // Required: 0-5
  aroma?: number; // Optional: 0-5
  appearance?: number; // Optional: 0-5
  taste?: number; // Optional: 0-5
  mouthfeel?: number; // Optional: 0-5
  notes?: string;
  flavorProfiles?: string[];
  presentationStyle?: string;
}
```
