const prisma = require('../prisma/client');

async function addToCart(userId, variantSizeId, quantity) {
    return await prisma.cartItem.create({
        data: {
            userId,
            variantSizeId,
            quantity,
        },
    });
}

async function getCartByUser(userId) {
    return await prisma.cartItem.findMany({
        where: { userId },
        include: {
            variantSize: {
                include: {
                    variant: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
}

async function updateCartItem(cartItemId, quantity) {
    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });
}

async function removeFromCart(cartItemId) {
    return await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
}

module.exports = {
    addToCart,
    getCartByUser,
    updateCartItem,
    removeFromCart,
};