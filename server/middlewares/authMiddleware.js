const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({status: false ,   error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({status: false ,   error: 'Invalid token' });
    }
};

module.exports = { authMiddleware };
