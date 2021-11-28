const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if(process.env.NODE_ENV === 'dev'){
    const envFound = dotenv.config({path: 'config/.env'});
    if(envFound.error){
        throw new Error("⚠️ .env file not found ⚠️");
    }
}

module.exports = {
    baseUrl: process.env.BASE_URL,
    port: parseInt(process.env.PORT, 10),
    dbURI: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgo: process.env.JWT_ALGO,
    apiPrefix: '/api',
    mail: {
        id: process.env.MAIL_USER,
        pass:process.env.MAIL_PASS 
    },
}