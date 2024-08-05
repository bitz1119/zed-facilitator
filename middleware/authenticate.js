const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.AccessToken;
    if (!token) return res.status(401).send('Access denied');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(token, err);
        res.status(400).send('Invalid token');
    }
};
