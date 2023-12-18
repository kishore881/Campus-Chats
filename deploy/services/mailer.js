const nodemailer = require('nodemailer')
const config = require('../config');
 
const credentials = {
  service: 'gmail',
  auth: {
    user: config.mail.id, 
    pass: config.mail.pass 
  },
  tls : { rejectUnauthorized: false }
}

const transporter = nodemailer.createTransport(credentials);

// content to send in the confirmation mail generated from user ID
const content = (userId) => {
    return {
        subject: "Campus Chats Confirm Email",
        html: `<html>
                <body> 
                <h5> Welcome to Campus Chats!!</h5> 
                <p>
                  </a> click <a href="https://${config.baseUrl}/verify/${userId}"> here </a> to confirm your account on Campus Chats.
                </p>
                <p> Copy Paste the below link into the browser, if it doesn't work. <br> Verification Link: https://${config.baseUrl}/verify/${userId} </p>
                </body>
                </html>`,
    };
}

// function to send the mail to 'to' address and content generated using userId
const sendEmail = async (to, userId) => {
    const contacts = {
        from: config.mail.id,
        to
    }
    const email = Object.assign({}, content(userId), contacts)
    const res = await transporter.sendMail(email);
    return res;
}


module.exports = {sendEmail}