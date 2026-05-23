const router = require('express').Router();
const {
    addToCartHandler,
    getCartHandler,
    updateCartHandler,
    removeCartHandler,
} = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addToCartHandler);

router.get('/', authMiddleware, getCartHandler);

router.patch('/:cartItemId', authMiddleware, updateCartHandler);

router.delete('/:cartItemId', authMiddleware, removeCartHandler);

module.exports = router;