import nodemailer from 'nodemailer';
import path from 'path';


const sendCommanMails = async (emailID, subject, text, attachment) => {
    return new Promise((resolve, reject) => {
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
                from: "victorsing007@gmail.com",
                to: emailID,
                subject: subject,
                html: text,
                attachments: {
                    filename: attachment.filename,
                    path: path.resolve(attachment.path)
                }
            };


            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                     reject(error);
                } else {
                    resolve(`Email sent successfully: ${info.response}`);
                }
            });
        } catch (err) {
             reject(err);
        }
    });
};

export default sendCommanMails;
