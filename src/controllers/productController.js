const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    searchProducts,
} = require('../services/productService');

async function create(req, res) {
    try {
        const product = await createProduct(req.body);

        return res.status(201).json({
            message: 'Product berhasil dibuat',
            product,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function getAll(req, res) {
    try {
        const products = await getAllProducts();

        return res.json({
            products,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;

        const product = await getProductById(id);

        return res.json({
            product,
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
}

async function getBySlug(req, res) {
    try {
        const { slug } = req.params;

        const product = await getProductBySlug(slug);

        return res.json({
            product,
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;

        const product = await updateProduct(id, req.body);

        return res.json({
            message: 'Product berhasil diupdate',
            product,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;

        const result = await deleteProduct(id);

        return res.json(result);
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
}

async function search(req, res) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Query pencarian wajib diisi',
            });
        }

        const products = await searchProducts(q);

        return res.json({
            products,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
    create,
    getAll,
    getById,
    getBySlug,
    update,
    remove,
    search,
};