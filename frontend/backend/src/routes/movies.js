const express = require('express');
const { getGenres, discoverMovies, searchMovies, trendingMovies, getMovieDetails } = require('../controllers/moviesController');

const router = express.Router();

router.get('/genres', getGenres);
router.get('/movies/discover', discoverMovies);
router.get('/movies/search', searchMovies);
router.get('/movies/trending', trendingMovies);
router.get('/movies/:id', getMovieDetails);

module.exports = router;
