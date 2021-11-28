const config = require('./config/index.js');
const express = require('express');
const loaders = require('./loaders');
const winston = require('winston');
const routes = require('./api');

async function startServer() {
    const app = express();

    await loaders({app, routes, config}).catch((err) => {
        winston.error(err);
        process.exit(1);
    });
    
    app.listen(config.port, ()=>{
        winston.info(`✌️ Server listening on port: ${config.port} ✌️`);
    }).on('error', err => {
        winston.error(err);
        process.exit(1);
    });
}

startServer();