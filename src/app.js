const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const midtransRoutes = require('./routes/midtransRoutes');

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({
        message: 'Backend aktif',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/midtrans', midtransRoutes);

module.exports = app;