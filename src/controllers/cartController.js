const {
    addToCart,
    getCartItems,
    removeFromCart,
} = require('../services/cartServices');

export async function addToCartHandler(req, res) {
    try {
        const { userId, variantSizeId, quantity } = req.body;

        const cartItem = await addToCart(userId, variantSizeId, quantity);

        return res.status(201).json(cartItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getCartItemsHandler(req, res) {
    try {
        const { userId } = req.params;

        const items = await getCartItems(userId);

        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function removeFromCartHandler(req, res) {
    try {
        const { cartItemId } = req.params;

        await removeFromCart(cartItemId);

        return res.json({ message: 'Deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}