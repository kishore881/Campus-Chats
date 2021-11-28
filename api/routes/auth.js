const route = require('express').Router();
const middlewares = require('../middlewares');
const { celebrate, Joi } = require('celebrate');
const winston = require('winston');
const day = 24*60*60*1000;

module.exports = ({app, authService, mailService}) => {
    app.use('/auth', route);

    route.get('/checkUser', middlewares.isAuthenticated, (req, res) => {
        try{
            return res.json({_id: req.token._id, email: req.token.email}).end();
        } catch(err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

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

                return res.cookie('token', token, {maxAge: expires, secure, httpOnly: true}).json(user);
            } catch (err) {
                return res.json({status: 401, message: err.message}).end();
            }
        }
    );

    route.post('/signout', middlewares.isAuthenticated, (req, res, next) => {
        try {
          //@TODO authService.Logout(req.user) do some clever stuff
          winston.debug(`User ${req.token._id} Signed Out`);
          return res.clearCookie('token').json({message: "logged out"}).end();
        } catch (e) {
          winston.error('🔥 error %o', e);
          return next(e);
        }
    });

    route.post('/confirm/:id', async (req, res, next) => {
        const {id} = req.params;
        try{
            winston.debug(`User ${id} Request to Confirm MailId`);
            const confirmed = await authService.confirmUser(id);
            setTimeout(() => {res.json({message: 'verified'}).end();}, 5000)
            return res;
        }catch(e){
            winston.error(e);
            return next(e);
        }
    });
}