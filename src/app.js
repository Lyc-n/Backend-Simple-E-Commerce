const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const midtransRoutes = require('./routes/midtransRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();
const path = require('path');

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({
        message: 'Backend aktif',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/midtrans', midtransRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

module.exports = app;