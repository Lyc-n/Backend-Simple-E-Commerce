const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
    try {
        const bearer = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null;

        const token = req.cookies.accessToken || bearer;

        if (!token) {
            return res.status(401).json({
                message: 'Belum login',
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid',
        });
    }
}

module.exports = authMiddleware;