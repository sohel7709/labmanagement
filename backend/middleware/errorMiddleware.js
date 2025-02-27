const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Log error for debugging
    console.error({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        user: req.user ? req.user._id : 'unauthenticated',
        lab: req.labContext || 'no lab context'
    });

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};
