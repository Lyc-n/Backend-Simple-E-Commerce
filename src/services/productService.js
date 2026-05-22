const prisma = require('../config/prisma');

async function createProduct(payload) {
    const {
        name,
        slug,
        description,
        imageUrl,
        variants,
    } = payload;

    if (!name || !slug) {
        throw new Error('Name dan slug wajib diisi');
    }

    const existingProduct = await prisma.product.findUnique({
        where: {
            slug,
        },
    });

    if (existingProduct) {
        throw new Error('Slug sudah digunakan');
    }

    const product = await prisma.product.create({
        data: {
            name,
            slug,
            description,
            imageUrl,

            variants: {
                create: variants?.map((variant) => ({
                    name: variant.name,
                    flavor: variant.flavor,

                    sizes: {
                        create: variant.sizes?.map((size) => ({
                            size: size.size,
                            price: size.price,
                            stock: size.stock,
                        })),
                    },
                })),
            },
        },

        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },
    });

    return product;
}

async function getAllProducts() {
    const products = await prisma.product.findMany({
        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return products;
}

async function getProductById(id) {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },

        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },
    });

    if (!product) {
        throw new Error('Product tidak ditemukan');
    }

    return product;
}

async function getProductBySlug(slug) {
    const product = await prisma.product.findUnique({
        where: {
            slug,
        },

        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },
    });

    if (!product) {
        throw new Error('Product tidak ditemukan');
    }

    return product;
}

async function updateProduct(id, payload) {
    const {
        name,
        slug,
        description,
        imageUrl,
        variants,
    } = payload;

    const existingProduct = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!existingProduct) {
        throw new Error('Product tidak ditemukan');
    }

    if (slug) {
        const slugExists = await prisma.product.findFirst({
            where: {
                slug,
                NOT: {
                    id,
                },
            },
        });

        if (slugExists) {
            throw new Error('Slug sudah digunakan');
        }
    }

    await prisma.variantSize.deleteMany({
        where: {
            variant: {
                productId: id,
            },
        },
    });

    await prisma.productVariant.deleteMany({
        where: {
            productId: id,
        },
    });

    const updatedProduct = await prisma.product.update({
        where: {
            id,
        },

        data: {
            name,
            slug,
            description,
            imageUrl,

            variants: {
                create: variants?.map((variant) => ({
                    name: variant.name,
                    flavor: variant.flavor,

                    sizes: {
                        create: variant.sizes?.map((size) => ({
                            size: size.size,
                            price: size.price,
                            stock: size.stock,
                        })),
                    },
                })),
            },
        },

        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },
    });

    return updatedProduct;
}

async function deleteProduct(id) {
    const existingProduct = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!existingProduct) {
        throw new Error('Product tidak ditemukan');
    }

    await prisma.product.delete({
        where: {
            id,
        },
    });

    return {
        message: 'Product berhasil dihapus',
    };
}

async function searchProducts(query) {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },

        include: {
            variants: {
                include: {
                    sizes: true,
                },
            },
        },
    });

    return products;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    searchProducts,
};