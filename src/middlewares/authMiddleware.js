const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
    try {
        const bearer = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null;

        const token = req.cookies.auth_token || bearer;

        if (!token) {
            return res.status(401).json({
                message: 'Belum login',
            });
        }

        const decoded = verifyToken(token);

        req.auth = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid',
        });
    }
}

module.exports = authMiddleware;