const express = require('express');
const userId = require('../middleware/userId');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistStatus,
} = require('../controllers/wishlistController');

const router = express.Router();

router.use(userId);

router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:movieId', removeFromWishlist);
router.get('/wishlist/:movieId/status', getWishlistStatus);

module.exports = router;
