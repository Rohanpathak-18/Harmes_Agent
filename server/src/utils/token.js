const crypto = require("crypto");

const generateSessionToken = () => {
    return crypto.randomBytes(48).toString("hex");
};

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateSessionToken,
    hashToken,
};