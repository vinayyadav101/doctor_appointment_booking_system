import nodemailer from 'nodemailer'
import crypto from 'crypto'
import logging from '../config/logfileConfig.js';


const otps ={};

const sendOtp = async(emailID)=>{

        const otp = crypto.randomInt(100000 , 999999).toString()

        otps[emailID] = otp

    try {
        const transporter = nodemailer.createTransport({
            service:process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_SERVICE_HOST,
            auth: {
                user: process.env.EMAIL_SERVICE_USER,
                pass: process.env.EMAIL_SERVICE_PASS 
            }
        });
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to : emailID,
            subject: 'verify your email',
            text: `your otp code is ${otp}`
        }

        const sendmail = await transporter.sendMail(mailOptions)
        
        
    } catch (error) {
        logging.error(error)
        return error
    }
}

export {
    otps,
    sendOtp
}