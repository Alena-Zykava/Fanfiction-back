const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log("token", token);
        if (!token) {
            return res.status(403).json({ message: "User not authorization" });
        }
        const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log('user', decodedData);
        req.user = decodedData;
        next();
    } catch (e) {
        return res.status(403).json({ message: "User not authorization" });
    }
};