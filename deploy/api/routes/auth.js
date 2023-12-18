const route = require('express').Router();
const middlewares = require('../middlewares');
const { celebrate, Joi } = require('celebrate');
const winston = require('winston');
const day = 24*60*60*1000;

module.exports = ({app, authService, mailService}) => {
    app.use('/auth', route);

    /* helps front-end to check if user has to sign in or not based on token sent in the cookie. 
    If not user info is extracted from token and returned*/
    route.get('/checkUser', middlewares.isAuthenticated, (req, res) => {
        try{
            return res.json({_id: req.auth._id, email: req.auth.email}).end();
        } catch(err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

    // sign up a user and send a confirmation mail to them
    route.post(
        '/signup', 
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }), 
        async (req, res) => {
            try {
                const user = await authService.SignUp(req.body);
                
                winston.debug(`User ${user._id} Signed Up`);

                const sentMsg = await mailService.sendEmail(user.email, user._id);
                
                winston.debug(`User ${user._id} Confirmation Mail sent`);
                
                res.json({message: 'Confirmation mail sent', msg: sentMsg}).end();
            } catch (err) {
                return res.json({status: 401, message: err.message}).end();
            }
        }
    );

    route.post(
        '/signin',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }), 
        async (req, res) => {
            try {
                const { email, password } = req.body;
                const { user, token } = await authService.SignIn(email, password);
                const expires = process.env.NODE_ENV == 'dev' ?  day : 7*day;
                const secure = process.env.NODE_ENV == 'production';
              
                winston.debug(`User ${user._id} Signed In`);

                // set the JWT generate in a cookie and sennd it along with signed in user info
                return res.cookie('token', token, {maxAge: expires, secure, httpOnly: true}).json(user).end();
            } catch (err) {
                return res.json({status: 401, message: err.message}).end();
            }
        }
    );

    // clear the cookie holding JWT thus denying access when /checkuser route is called
    route.post('/signout', middlewares.isAuthenticated, (req, res, next) => {
        try {
          winston.debug(`User ${req.auth._id} Signed Out`);
          return res.clearCookie('token').json({message: "logged out"}).end();
        } catch (e) {
          winston.error('🔥 error %o', e);
          return next(e);
        }
    });

    // confirm path for email verification simply marks the user object id received as confirmed
    route.post('/confirm/:id', async (req, res, next) => {
        const {id} = req.params;
        try{
            winston.debug(`User ${id} Request to Confirm MailId`);
            const confirmed = await authService.confirmUser(id);
            return res.json({message: 'verified'}).end();
        }catch(e){
            winston.error(e);
            return next(e);
        }
    });
}