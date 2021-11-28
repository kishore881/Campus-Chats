const {isAuthenticated} = require('./auth.js');


/*
    the express-jwt library is configured to check for token and its validity in req
    if no token found or token is invalid it throws error which are handled in express loader
    otherwise attaches token to request object
*/
module.exports = {isAuthenticated}