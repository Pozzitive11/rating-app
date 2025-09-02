const mongoose = require('mongoose');

const beerRatingSchema = new mongoose.Schema({
  // Original beer data from Untappd
  originalBeer: {
    name: { type: String, required: true },
    brewery: { type: String, required: true },
    style: { type: String },
    abv: { type: Number },
    ibu: { type: Number },
    rating: { type: Number }, // Original Untappd rating
    numberOfRatings: { type: Number },
    image: { type: String },
    link: { type: String },
    description: { type: String }
  },

  // User's custom rating data
  userRating: {
    overall: { type: Number, required: true, min: 0, max: 5 },
    
    // Detailed ratings (optional)
    aroma: { type: Number, min: 0, max: 5 },
    appearance: { type: Number, min: 0, max: 5 },
    taste: { type: Number, min: 0, max: 5 },
    mouthfeel: { type: Number, min: 0, max: 5 },
    
    // Additional user data
    notes: { type: String },
    reviewDate: { type: Date, default: Date.now },
    
    // Style and flavor profiles
    flavorProfiles: [{ type: String }], // e.g., ["hoppy", "malty", "fruity"]
    presentationStyle: { type: String }, // e.g., "draft", "bottle", "can"
    
    // User identification (optional - you can add user auth later)
    userIP: { type: String },
    sessionId: { type: String }
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient querying
beerRatingSchema.index({ 'originalBeer.name': 1, 'originalBeer.brewery': 1 });
beerRatingSchema.index({ 'userRating.reviewDate': -1 });

// Update the updatedAt field before saving
beerRatingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find ratings by beer name
beerRatingSchema.statics.findByBeer = function(beerName, brewery) {
  return this.find({
    'originalBeer.name': new RegExp(beerName, 'i'),
    'originalBeer.brewery': new RegExp(brewery, 'i')
  });
};

// Instance method to get a formatted rating summary
beerRatingSchema.methods.getRatingSummary = function() {
  return {
    beer: `${this.originalBeer.name} by ${this.originalBeer.brewery}`,
    userRating: this.userRating.overall,
    originalRating: this.originalBeer.rating,
    reviewDate: this.userRating.reviewDate
  };
};

module.exports = mongoose.model('BeerRating', beerRatingSchema);

