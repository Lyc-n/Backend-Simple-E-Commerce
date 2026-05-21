const {
    registerUser,
    loginUser,
} = require('../services/authServices');

const { readUsers } = require('../utils/usersStore');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',

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
        const users = await readUsers();

        const user = users.find(
            (u) => u.id === req.auth.sub
        );

        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }

        const { passwordHash, ...safeUser } = user;

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
        sameSite: COOKIE_OPTIONS.sameSite,
        secure: COOKIE_OPTIONS.secure,
    });

    return res.json({
        message: 'Logout berhasil',
    });
}

module.exports = {
    register,
    login,
    me,
    logout,
};