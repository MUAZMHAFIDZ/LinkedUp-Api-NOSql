const API_KEY = "muazmhafidz";  
const verifyApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res.status(401).json({ message: 'API key tidak ditemukan' });
    }
    if (apiKey !== API_KEY) {
        return res.status(403).json({ message: 'API key tidak valid' });
    }
    next();
};
module.exports = verifyApiKey;
