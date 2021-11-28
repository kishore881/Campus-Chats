const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const winston = require('winston');

module.exports = ({app, routes, apiPrefix}) => {
    if(process.env.NODE_ENV === 'production'){
      app.use((req, res, next) =>{
        if (req.headers['x-forwarded-proto'] !== 'https') {
          return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        return next();
      });
    }
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use(apiPrefix, routes());

    app.use(express.static("client/build"));
    app.get("*", function (req, res) {
      res.sendFile("index.html", { root: "client/build" });
    });
    
    
    // error handlers
    app.use((err, req, res, next) => {
      // Handle 401 thrown by express-jwt library
      if (err.name === 'UnauthorizedError') {
        if(err.code === 'revoked_token'){
          return res.clearCookie('token').json({status: err.status, code:'revoked_token', 
            message: 'Your session has expired. Signing you out now.. Please SignIn again.'}).end();
        }else if(err.code === 'credentials_required'){
          return res.json({status: err.status, message: err.name + ': Please SignIn first.'}).end();
        }else{
          return res.json({status: err.status, message: err.message}).end();
        }
      }else{
        return next(err);
      }
    });
    app.use((err, req, res, next) => {
      winston.error(err);
      res.status(err.status || 500).json({message: err.message}).end();
    });
}