"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = async (email, subject, html) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Laptopcv 👻" <no-reply@example.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        html,
    });

    return info;
}

module.exports = sendEmail; 
