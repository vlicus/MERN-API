module.exports = (err, req, res, next) => {
    if (err.name === 'CastError') {
        res.status(400).end();
    } else {
        res.status(500).end();
    }
};
