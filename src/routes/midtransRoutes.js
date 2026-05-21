const express = require('express');
const router = express.Router();

const {
    createTransaction,
    handleNotification,
} = require('../controllers/midtransController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-transaction', authMiddleware, createTransaction);

router.post('/notification', handleNotification);

module.exports = router;