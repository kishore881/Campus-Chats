const winston = require('winston');

module.exports = () => {
    let transports = [];
    if(process.env.NODE_ENV == 'dev') {
        transports.push(new (winston.transports.Console)({
            level: 'silly'
        }))
    } else {
        transports.push(new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/filelog-info.log',
            level: 'info'
        }))
        transports.push(new (winston.transports.File)({
            name: 'error-file',
            filename: 'logs/filelog-error.log',
            level: 'error'
        }))
    }

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