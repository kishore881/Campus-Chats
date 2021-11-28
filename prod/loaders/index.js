const mongooseLoader = require('./mongoose');
const configureLogger = require('./logger');
const winston = require('winston');
const expressLoader = require('./express');

module.exports = async ({app, routes, config}) => {
    configureLogger();
    winston.info('✌️ Winston Logger configured!');

    const mongooseConnection = await mongooseLoader(config.dbURI);
    winston.info('✌️ DB loaded and connected!');

    expressLoader({app, routes, apiPrefix:config.apiPrefix});
    winston.info('✌️ Express loaded!');
}