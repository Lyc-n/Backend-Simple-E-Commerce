const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const { readUsers, writeUsers } = require('../utils/usersStore');
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

    const users = await readUsers();

    const emailLower = email.toLowerCase();
    const usernameLower = username.toLowerCase();

    const exists = users.some(
        (user) =>
            user.email.toLowerCase() === emailLower ||
            user.username.toLowerCase() === usernameLower
    );

    if (exists) {
        throw new Error('Email atau username sudah dipakai');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: randomUUID(),
        name,
        username,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    await writeUsers(users);

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

    const users = await readUsers();

    const identityLower = identity.toLowerCase();

    const user = users.find(
        (u) =>
            u.email.toLowerCase() === identityLower ||
            u.username.toLowerCase() === identityLower
    );

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

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
    const { passwordHash, ...safeUser } = user;

    return safeUser;
}

module.exports = {
    registerUser,
    loginUser,
};