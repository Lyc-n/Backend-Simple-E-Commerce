const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const midtransRoutes = require('./routes/midtransRoutes');

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://sterling-wren-modern.ngrok-free.app',
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
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