const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    const authorization = req.get('authorization');

    let token = '';

    if (
        authorization &&
        authorization.toLocaleLowerCase().startsWith('bearer')
    ) {
        token = authorization.substring(7);
    }

    let decodedToken = {};
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        next(error);
    }

    if (!token || !decodedToken.id) {
        return res.status(401).json({
            error: 'token missing or invalid',
        });
    }

    const { id: userId } = decodedToken;

    req.userId = userId;

    next();
};
