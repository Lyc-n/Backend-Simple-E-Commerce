const {
    registerUser,
    loginUser,
    updateProfile,
} = require('../services/authServices');

const prisma = require('../config/prisma');

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function register(req, res) {
    try {
        const result = await registerUser(req.body);

        res.cookie(
            'auth_token',
            result.token,
            COOKIE_OPTIONS
        );

        return res.status(201).json({
            message: 'Register berhasil',
            user: result.user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function login(req, res) {
    try {
        const result = await loginUser(req.body);

        res.cookie(
            'auth_token',
            result.token,
            COOKIE_OPTIONS
        );

        return res.json({
            message: 'Login berhasil',
            user: result.user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function me(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.auth.sub,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }

        const { password, ...safeUser } = user;

        return res.json({
            user: safeUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal mengambil user',
        });
    }
}

function logout(req, res) {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: COOKIE_OPTIONS.secure,
        sameSite: COOKIE_OPTIONS.sameSite,
    });

    return res.json({
        message: 'Logout berhasil',
    });
}

async function updateMyProfile(req, res) {
    try {
        const user = await updateProfile(
            req.auth.sub,
            req.body
        );

        return res.json({
            message: 'Profile berhasil diupdate',
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

module.exports = {
    register,
    login,
    me,
    logout,
    updateMyProfile,
};