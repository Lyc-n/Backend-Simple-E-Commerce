const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function generateToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
        },
        JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken,
};