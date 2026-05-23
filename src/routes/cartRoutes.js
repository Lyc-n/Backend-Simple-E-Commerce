const router = require('express').Router();
const controller = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, controller.addToCartHandler);

router.get('/', authMiddleware, controller.getCartHandler);

router.patch('/:cartItemId', authMiddleware, controller.updateCartHandler);

router.delete('/:cartItemId', authMiddleware, controller.removeCartHandler);

module.exports = router;