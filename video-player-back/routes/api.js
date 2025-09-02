const express = require('express');
const path = require('path');
const fs = require('fs');
const { fetchBeers } = require('../middleware/untappd');
const BeerRating = require('../models/BeerRating');
const router = express.Router();



// Get all videos
// router.get('/beers', (req, res) => {
//   try {
//     const videos = videoFiles.map(file => {
//       const filePath = path.join(uploadsPath, file);
//       const stats = fs.statSync(filePath);
      
//       return {
//         id: file,
//         name: file,
//         originalName: file,
//         url: `/uploads/${file}`,
//         size: stats.size,
//         uploadDate: stats.birthtime,
//         mimetype: `video/${path.extname(file).slice(1)}`
//       };
//     });

//     res.json({ videos });
//   } catch (error) {
//     console.error('Error fetching videos:', error);
//     res.status(500).json({ error: 'Failed to fetch videos' });
//   }
// });

// Search for multiple beers
router.get('/beers/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1 } = req.query;
    
    const beers = await fetchBeers(query, parseInt(page));
    
    if (beers.length === 0) {
      return res.status(404).json({ error: 'No beers found' });
    }

    console.log(`✅ Found ${beers.length} beers for query: ${query}`);
    res.json(beers);
  } catch (error) {
    console.error('Error searching beers:', error);
    res.status(500).json({ error: 'Failed to search beers' });
  }
});

// ========================
// BEER RATING ENDPOINTS
// ========================

// Save a new beer rating
router.post('/ratings', async (req, res) => {
  try {
    const { originalBeer, userRating } = req.body;

    // Validate required fields
    if (!originalBeer || !userRating || !userRating.overall) {
      return res.status(400).json({ 
        error: 'Missing required fields. originalBeer and userRating.overall are required.' 
      });
    }

    // Add user identification (IP and session for now)
    const userIP = req.ip || req.connection.remoteAddress;
    const sessionId = req.headers['x-session-id'] || 'anonymous';

    // Create new beer rating
    const beerRating = new BeerRating({
      originalBeer,
      userRating: {
        ...userRating,
        userIP,
        sessionId
      }
    });

    const savedRating = await beerRating.save();
    
    console.log(`✅ Saved rating for: ${originalBeer.name} by ${originalBeer.brewery}`);
    res.status(201).json({ 
      message: 'Beer rating saved successfully',
      rating: savedRating,
      summary: savedRating.getRatingSummary()
    });

  } catch (error) {
    console.error('Error saving beer rating:', error);
    res.status(500).json({ error: 'Failed to save beer rating' });
  }
});

// Get all beer ratings
router.get('/ratings', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 }
    };

    const ratings = await BeerRating.find()
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await BeerRating.countDocuments();

    console.log(`📊 Retrieved ${ratings.length} ratings (page ${page})`);
    res.json({
      ratings,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalRatings: total,
        hasNext: options.page * options.limit < total,
        hasPrev: options.page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get ratings for a specific beer
router.get('/ratings/beer/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { brewery } = req.query;
    
    console.log(`🔍 Searching ratings for beer: ${name}${brewery ? ` by ${brewery}` : ''}`);
    
    let query = { 'originalBeer.name': new RegExp(name, 'i') };
    
    if (brewery) {
      query['originalBeer.brewery'] = new RegExp(brewery, 'i');
    }

    const ratings = await BeerRating.find(query).sort({ 'userRating.reviewDate': -1 });
    
    if (ratings.length === 0) {
      return res.status(404).json({ error: 'No ratings found for this beer' });
    }

    // Calculate average user rating
    const avgUserRating = ratings.reduce((sum, rating) => sum + rating.userRating.overall, 0) / ratings.length;
    
    console.log(`✅ Found ${ratings.length} ratings for: ${name}`);
    res.json({
      beer: name,
      brewery: brewery,
      ratingsCount: ratings.length,
      averageUserRating: parseFloat(avgUserRating.toFixed(2)),
      ratings: ratings.map(rating => ({
        ...rating.toObject(),
        summary: rating.getRatingSummary()
      }))
    });

  } catch (error) {
    console.error('Error fetching beer ratings:', error);
    res.status(500).json({ error: 'Failed to fetch beer ratings' });
  }
});

// Get rating statistics
router.get('/ratings/stats', async (req, res) => {
  try {
    const totalRatings = await BeerRating.countDocuments();
    const avgRating = await BeerRating.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$userRating.overall' }
        }
      }
    ]);

    const topRatedBeers = await BeerRating.aggregate([
      {
        $group: {
          _id: {
            name: '$originalBeer.name',
            brewery: '$originalBeer.brewery'
          },
          averageRating: { $avg: '$userRating.overall' },
          ratingsCount: { $sum: 1 }
        }
      },
      { $match: { ratingsCount: { $gte: 1 } } },
      { $sort: { averageRating: -1 } },
      { $limit: 10 }
    ]);

    console.log('📈 Generated rating statistics');
    res.json({
      totalRatings,
      averageRating: avgRating[0]?.averageRating || 0,
      topRatedBeers
    });

  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: 'Failed to generate statistics' });
  }
});

module.exports = router; 