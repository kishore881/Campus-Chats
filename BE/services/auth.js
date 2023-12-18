const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const crypt = require('crypto');
const userModel = require('../models/user');
const config = require('../config');
const winston = require('winston');
const day = 24*60*60*1000;

// generate a JWT from user record with expiry set according the NODE_ENV
function generateToken(user){
    const {_id, email} = user;
    const expiresAt = process.env.NODE_ENV == 'dev' ? new Date(new Date().getTime() + day) : new Date(new Date().getTime() + 7*day);
    const token = jwt.sign({_id, email, expiresAt}, config.jwtSecret);
    return token;
}

// return a token and a user object with password and salt fields removed
function tokenFromUser(userRecord){
    const token = generateToken(userRecord);
    const user = userRecord.toObject();
    Reflect.deleteProperty(user, 'password');
    Reflect.deleteProperty(user, 'salt');
    return { user, token };
}

// create a new user record in database with status as pending
async function SignUp ({email, password}){
    try{
        const salt = crypt.randomBytes(32);
        const hashedPwd = await argon2.hash(password, {salt});

        const userRecord = await userModel.create({
            email,
            status: 'pending',
            password: hashedPwd,
            salt: salt.toString('hex')
        });

        if(!userRecord){
            throw new Error('User cannot be created');
        }

        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');

        return user;
    }catch(e){
        winston.error(e);
        throw e;
    }
}

// verify email and password combination and return corresponding user object
async function SignIn(email, password) {
    try{
        const userRecord = await userModel.findOne({ email });
        if (!userRecord) {
            throw new Error('Sign in failed. Invalid Credentials.');
        }

        const validPassword = await argon2.verify(userRecord.password, password);

        if (validPassword) {
            if (userRecord.status !== "confirmed") {
                throw new Error('Sign in Failed. User Email Address is not confirmed yet');
            }
            return tokenFromUser(userRecord);
        } else {
            throw new Error('Sign in failed. Invalid Credentials.');
        }
    }catch(e){
        winston.error(e);
        throw e;
    }
}

// update the status field of user to confirmed
async function confirmUser(id){
    const userRecord = await userModel.findByIdAndUpdate(id, {status: "confirmed"});
    if(!userRecord){
        throw new Error('User not found');
    }
    winston.debug(`User ${id} MailId confirmed`);

    return true;
}

module.exports = {SignUp, confirmUser, SignIn, tokenFromUser};