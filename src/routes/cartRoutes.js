const router = require('express').Router();
const controller = require('../controllers/cartController');

router.post('/', controller.addToCartHandler);
router.get('/:userId', controller.getCartHandler);
router.patch('/:cartItemId', controller.updateCartHandler);
router.delete('/:cartItemId', controller.removeCartHandler);

module.exports = router;