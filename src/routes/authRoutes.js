const express = require('express');

const {
    register,
    login,
    me,
    logout,
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', authMiddleware);
router.get('/me', authMiddleware, me);

module.exports = router;