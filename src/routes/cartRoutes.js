const router = require('express').Router();
const controller = require('../controllers/cartController');

router.post('/', controller.addToCartHandler);
router.get('/:userId', controller.getCartItemsHandler);
router.delete('/:cartItemId', controller.removeFromCartHandler);

module.exports = router;