const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Expected format: Bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // IMPORTANT: match how you signed token
        req.user = decoded.id || decoded.user?.id;

        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
