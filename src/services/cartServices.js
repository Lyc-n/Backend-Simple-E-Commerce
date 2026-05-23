const prisma = require('../config/prisma');

async function addToCart(
    userId,
    variantSizeId,
    quantity = 1
) {
    if (!userId) {
        throw new Error('Unauthorized');
    }

    if (!variantSizeId) {
        throw new Error('Variant size wajib diisi');
    }

    // cek variant exists
    const variantSize = await prisma.variantSize.findUnique({
        where: {
            id: variantSizeId,
        },
    });

    if (!variantSize) {
        throw new Error('Variant tidak ditemukan');
    }

    // cek existing cart item
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            userId,
            variantSizeId,
        },
    });

    // kalau sudah ada → tambah qty
    if (existingCartItem) {
        return await prisma.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity:
                    existingCartItem.quantity + quantity,
            },
        });
    }

    // kalau belum ada → create baru
    return await prisma.cartItem.create({
        data: {
            userId,
            variantSizeId,
            quantity,
        },
    });
}

async function getCartByUser(userId) {
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const cartItems = await prisma.cartItem.findMany({
        where: {
            userId,
        },

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

        orderBy: {
            createdAt: 'desc',
        },
    });

    // transform response biar frontend clean
    return cartItems.map((item) => ({
        id: item.id,

        quantity: item.quantity,

        productName:
            item.variantSize.variant.product.name,

        imageUrl:
            item.variantSize.variant.product.imageUrl,

        flavor:
            item.variantSize.variant.flavor,

        size:
            item.variantSize.size,

        price:
            item.variantSize.price,

        subtotal:
            item.variantSize.price * item.quantity,
    }));
}

async function updateCartItem(
    cartItemId,
    quantity
) {
    if (!cartItemId) {
        throw new Error('Cart item tidak ditemukan');
    }

    if (quantity < 1) {
        throw new Error('Quantity minimal 1');
    }

    return await prisma.cartItem.update({
        where: {
            id: cartItemId,
        },

        data: {
            quantity,
        },
    });
}

async function removeFromCart(cartItemId) {
    if (!cartItemId) {
        throw new Error('Cart item tidak ditemukan');
    }

    return await prisma.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
}

module.exports = {
    addToCart,
    getCartByUser,
    updateCartItem,
    removeFromCart,
};