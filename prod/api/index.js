const auth = require('./routes/auth');
const post = require('./routes/post');
const authService = require('../services/auth');
const mailService = require('../services/mailer');
const postService = require('../services/post');

module.exports = () => {
	const app = require('express').Router();

	auth({app, authService, mailService});
	post({app, postService});

	return app;
}