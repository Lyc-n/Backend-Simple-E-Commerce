const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');

async function registerUser(payload) {
    const {
        name,
        username,
        email,
        password,
        confirmPassword,
    } = payload;

    if (
        !name ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        throw new Error('Semua field wajib diisi');
    }

    if (password !== confirmPassword) {
        throw new Error('Password tidak sama');
    }

    if (password.length < 8) {
        throw new Error('Password minimal 8 karakter');
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ],
        },
    });

    if (existingUser) {
        throw new Error('Email atau username sudah dipakai');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: passwordHash,
        },
    });

    const token = generateToken(newUser);

    return {
        token,
        user: sanitizeUser(newUser),
    };
}

async function loginUser(payload) {
    const { identity, password } = payload;

    if (!identity || !password) {
        throw new Error('Email/username dan password wajib diisi');
    }

    const identityLower = identity.toLowerCase();

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identityLower },
                { username: identityLower },
            ],
        },
    });

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error('Password salah');
    }

    const token = generateToken(user);

    return {
        token,
        user: sanitizeUser(user),
    };
}

function sanitizeUser(user) {
    const { password, ...safeUser } = user;

    return safeUser;
}

async function updateProfile(userId, payload) {
    const {
        fullName,
        phone,
        address,
        bio,
    } = payload;

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: fullName,
            number: phone,
            address,
            bio,
        },
    });

    return sanitizeUser(updatedUser);
}

module.exports = {
    registerUser,
    loginUser,
    updateProfile
};