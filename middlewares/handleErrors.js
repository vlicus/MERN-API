const { TokenExpiredError } = require('jsonwebtoken');

const ERROR_HANDLERS = {
    CastError: (res) =>
        res.status(400).send({
            error: 'id used is malformed',
        }),
    ValidationError: (res, err) =>
        res.status(409).send({
            error: err.message,
        }),
    JsonWebTokenError: (res) =>
        res.status(401).json({
            error: 'token missing or invalid',
        }),
    TokenExpiredError: (res) =>
        res.status(401).json({
            error: 'token has expired, log in again',
        }),
    defaultError: (res) => res.status(500).end(),
};

module.exports = (err, req, res, next) => {
    console.log(err.name);
    const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError;
    handler(res, err);
};
