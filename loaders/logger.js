const winston = require('winston');

module.exports = () => {
    let transports = [];
    transports.push(new (winston.transports.Console)({
        level: 'silly'
    }))

    winston.configure({
        levels: winston.config.npm.levels,
        format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(info => `${info.level} | ${[info.timestamp]} | ${info.message}`),
        ),
        transports
    });
}