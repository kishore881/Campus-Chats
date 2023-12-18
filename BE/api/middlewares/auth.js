const { UnauthorizedError } = require('express-jwt');
const expressjwt = require('express-jwt');
const config = require('../../config');

const getTokenfromCookie = (req) => {
    const token = req.cookies.token || '';
    return token;
}

const checkRevoked = (req, token, done) => {
    let invalid = (new Date(token.expiresAt).getTime() < new Date().getTime());
    return done(null, invalid);
}

const isAuthenticated = expressjwt.expressjwt({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgo],
    credentialsRequired: true,
    getToken: getTokenfromCookie,
    isRevoked: checkRevoked,
    userProperty: 'token',
});

module.exports = {isAuthenticated}