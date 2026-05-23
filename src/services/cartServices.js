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

async function getCartItems(userId) {
    return await prisma.cartItem.findMany({
        where: { userId },
        include: {
            variantSize: {
                include: { variant: true },
            },
        },
    });
}

async function removeFromCart(cartItemId) {
    return await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
}

module.exports = {
    addToCart,
    getCartItems,
    removeFromCart,
};