import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
    process.env.PRISMA_DATABASE_URL;

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
    'Beef BBQ',
    'Cheese',
    'Balado',
];

const products = Array.from({ length: 30 }).map(
    (_, index) => {
        const productNumber = index + 1;

        return {
            name: `Chitato Crunch ${productNumber}`,
            slug: `chitato-crunch-${productNumber}`,

            description:
                `Keripik kentang premium varian ke-${productNumber} ` +
                `dengan rasa gurih dan tekstur renyah khas Chitato.`,

            imageUrl:
                `https://picsum.photos/seed/chitato-${productNumber}/600/600`,

            variants: flavors.map((flavor) => ({
                name: `${flavor} Edition`,
                flavor,

                sizes: [
                    {
                        size: 'Mini',
                        price:
                            8000 +
                            productNumber * 100,
                        stock: 20,
                    },

                    {
                        size: 'Medium',
                        price:
                            12000 +
                            productNumber * 100,
                        stock: 35,
                    },

                    {
                        size: 'Jumbo',
                        price:
                            18000 +
                            productNumber * 100,
                        stock: 15,
                    },
                ],
            })),
        };
    }
);

async function main() {
    console.log(
        '🧹 Menghapus data lama...'
    );

    await prisma.variantSize.deleteMany();

    await prisma.productVariant.deleteMany();

    await prisma.product.deleteMany();

    console.log(
        '🌱 Memasukkan 30 produk dummy...'
    );

    for (const product of products) {
        await prisma.product.create({
            data: {
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                imageUrl: product.imageUrl,

                variants: {
                    create: product.variants.map(
                        (variant) => ({
                            name: variant.name,
                            flavor:
                                variant.flavor,

                            sizes: {
                                create:
                                    variant.sizes,
                            },
                        })
                    ),
                },
            },
        });
    }

    console.log(
        '✅ Seeder berhasil dijalankan'
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });