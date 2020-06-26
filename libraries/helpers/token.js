const jwt = require('jsonwebtoken');
const config = require('../../config/env/common');

exports.createToken = payload => {
    return jwt.sign(payload, config.secretKey.access_token, { expiresIn: 86400000 });
};

exports.decodeToken = token => {
    return jwt.verify(token, config.secretKey.access_token);
};