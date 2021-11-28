const mongooseLoader = require('./mongoose');
const configureLogger = require('./logger');
const winston = require('winston');
const expressLoader = require('./express');

/*
    loaders to set up and configure the different things required for server.
    The following function calls the loaders with the given express app to configure, the router and application configuration
*/
module.exports = async ({app, routes, config}) => {
    configureLogger();
    winston.info('✌️ Winston Logger configured!');

    const mongooseConnection = await mongooseLoader(config.dbURI);
    winston.info('✌️ DB loaded and connected!');

    expressLoader({app, routes, apiPrefix:config.apiPrefix});
    winston.info('✌️ Express loaded!');
}