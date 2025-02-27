const loggingMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    console.log('Request Params:', req.params);
    console.log('Request Query:', req.query);

    // Capture the original json method
    const originalJson = res.json;

    // Override the json method
    res.json = function (body) {
        console.log('Response Body:', body);
        return originalJson.call(this, body);
    }

    // Add error logging
    const originalSend = res.send;
    res.send = function (body) {
        console.log('Response Status:', res.statusCode);
        console.log('Response Body:', body);
        return originalSend.call(this, body);
    }

    // Log unhandled errors
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Error ${res.statusCode}: ${res.statusMessage}`);
        }
    });

    next();
};

module.exports = loggingMiddleware;
