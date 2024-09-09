import nodemailer from 'nodemailer'
import crypto from 'crypto'
import logging from '../config/logfileConfig.js';

const otps ={};

const sendOtp = async(emailID)=>{

        const otp = crypto.randomInt(100000 , 999999).toString()

        otps[emailID] = otp

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to : emailID,
            subject: 'verify your email',
            text: `your otp code is ${otp}`
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        logging.error(error)
    }
}

export {
    otps,
    sendOtp
}