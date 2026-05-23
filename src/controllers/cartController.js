const {
    addToCart,
    getCartByUser,
    updateCartItem,
    removeFromCart,
} = require('../services/cartServices');

function mapCart(items) {
    return items.map((item) => {
        const product = item.variantSize.variant.product;

        return {
            id: item.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            flavor: item.variantSize.variant.flavor,
            size: item.variantSize.size,
            price: item.variantSize.price,
            quantity: item.quantity,
            subtotal: item.quantity * item.variantSize.price,
        };
    });
}

async function addToCartHandler(req, res) {
    try {
        const userId = req.userId;
        const { userId, variantSizeId, quantity } = req.userId;

        const result = await addToCart(userId, variantSizeId, quantity);

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getCartHandler(req, res) {
    try {
        const userId = req.userId;

        const items = await getCartItems(userId);

        return res.json({
            items,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function updateCartHandler(req, res) {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const updated = await updateCartItem(cartItemId, quantity);

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function removeCartHandler(req, res) {
    try {
        const { cartItemId } = req.params;

        await removeFromCart(cartItemId);

        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addToCartHandler,
    getCartHandler,
    updateCartHandler,
    removeCartHandler,
};