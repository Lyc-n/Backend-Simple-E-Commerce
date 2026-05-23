import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.PRISMA_DATABASE_URL;

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

const flavors = [
    'Original',
    'Spicy',
    'Nori',
    'Beef',
    'Cheese',
    'Balado',
];

const thumbnailUrl = [
    'ayamBumbu.png',
    'kejuSupreme.png',
    'sapiPanggang.png',
];

const tagPool = ['New', 'Hot', 'Sale', 'Best Seller', null];

const tagColorPool = ['primary', 'secondary-fixed'];

const products = Array.from({ length: 30 }).map((_, index) => {
    const productNumber = index + 1;

    return {
        name: `Chitato Crunch ${productNumber}`,
        slug: `chitato-crunch-${productNumber}`,

        description:
            `Keripik kentang premium varian ke-${productNumber} ` +
            `dengan rasa gurih dan tekstur renyah khas Chitato.`,

        imageUrl: `/assets/${thumbnailUrl[index % thumbnailUrl.length]}`,

        tag: tagPool[index % tagPool.length],
        tagColor: tagColorPool[index % tagColorPool.length],

        variants: flavors.map((flavor) => {
            const base = productNumber * 100;

            return {
                name: `${flavor} Edition`,
                flavor,

                sizes: [
                    {
                        size: 'Mini',
                        price: 8000 + base,
                        stock: 20,
                    },
                    {
                        size: 'Medium',
                        price: 12000 + base,
                        stock: 35,
                    },
                    {
                        size: 'Jumbo',
                        price: 18000 + base,
                        stock: 15,
                    },
                ],
            };
        }),
    };
});

async function main() {
    console.log('🧹 Menghapus data lama...');

    await prisma.variantSize.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();

    console.log('🌱 Memasukkan 30 produk dummy...');

    for (const product of products) {
        // hitung basePrice (MIN dari semua variant sizes)
        const allPrices = product.variants.flatMap((v) =>
            v.sizes.map((s) => s.price)
        );

        const basePrice = Math.min(...allPrices);

        await prisma.product.create({
            data: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                imageUrl: product.imageUrl,

                tag: product.tag,
                tagColor: product.tagColor,

                basePrice,

                variants: {
                    create: product.variants.map((variant) => ({
                        name: variant.name,
                        flavor: variant.flavor,

                        sizes: {
                            create: variant.sizes,
                        },
                    })),
                },
            },
        });
    }

    console.log('✅ Seeder berhasil dijalankan');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });