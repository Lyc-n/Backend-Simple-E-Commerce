const express = require('express');

const {
    register,
    login,
    me,
    logout,
    updateMyProfile,
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', authMiddleware, me);
router.get('/me', authMiddleware, me);

router.put('/profile', authMiddleware, updateMyProfile );

module.exports = router;