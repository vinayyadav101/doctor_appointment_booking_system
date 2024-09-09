

import logging from "../config/logfileConfig.js";
import appointmentModel from "../models/appointmentSchema.js";
import doctorModel from "../models/doctorSchema.js";
import appError from "../utils/error.util.js";
import {v2 as cloudinary}  from 'cloudinary'
import path from 'path'
import  fs  from "fs/promises";
import sendCommanMails from "../utils/sendCommanMails.js";



const register = async(req,res,next) =>{


        const {doctorName , email , specialty, qualifications ,gender, experience , consultaionFee} = req.body;



    if (!email || !doctorName || !specialty || !qualifications || !experience || !consultaionFee ||!gender) {
        logging.error("for registration all fildes are required!")
        return next(new appError("All fields are required" , 400))
    }

        const findEmail = await doctorModel.findOne({email})



    if (findEmail) {
        logging.info("email alrady registerd")
        return next(new appError("email alrady registerd" , 409))
    }



    try {
        
            const doctor = await doctorModel.create({
                doctorName,
                email,
                gender,
                specialty,
                qualifications,
                experience,
                consultaionFee
            })
        

        if (!doctor) {
             logging.critical("doctor details not add some thecniacl error")
             return next(new appError("doctor details not add some thecniacl error",400))
        }

        res.status(200).json({
            code:1,
            msg:"doctor registerd",
            time:Date.now()
        })

    } catch (error) {
        logging.error(error || "erronr in doctor controller registerarion to add doctorMOdel")
        return next(new appError(error,500))
    }
}

const cancelAppoinment = async(req,res,next) => {

        const bookingID = req.params.id;

    try {
                const cancel = await appointmentModel.findByIdAndUpdate(
                    {
                        _id:bookingID
                    },
                    {
                        status:"cancel"
                    },
                    {
                        new:true
                    }
                )
            
                if (!cancel) {
                    logging.info("not valid id for cancel appointment")
                    return next(new appError("not valid id",400))
                }


            res.status(200).json({
                code:1,
                msg:"appointment cancel successfully",
                date:Date.now()
            })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}
const residual  = async(req,res,next) =>{
        const bookingID = req.params.id
        const {residual} = req.body;



    try {
        
            const residualAppointment = await appointmentModel.findByIdAndUpdate(
                {
                    _id:bookingID
                },
                {
                    residual
                },
                {
                    new:true
                }
            )
        if (!residualAppointment) {
            logging.error("not found appointment and not update residual")
            return next(new appError("not found appointment",404))
        }
            res.status(200).json({
                code:1,
                msg:"appointment successfully resadual",
                date:Date.now()
            })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}
const sendPrescription = async(req,res,next) => {
    
            const file = req.file;
            const appointmentID = req.query.id;


        if (!file || !appointmentID) {
            logging.info("please upload pdf only and chack query!")
            return next(new appError("file not sported only pdf"))
        }

             const findPaitent = await appointmentModel.findById({_id : appointmentID})
             

        if (!findPaitent) {
            logging.error("your email id not exit on databse! ,plesae chack your email")
            return next(new appError("your email id not exit on databse! ,plesae chack your email" , 404))        
        }

        if (!(findPaitent.status === 'confirm')) {
            fs.rm(file.path)
            logging.info("user not status confirm after confirm then send prescription.")
            return next(new appError("user not status confirm after confirm then send prescription." , 400))
        }
        
      try {
        

                const upload = await cloudinary.uploader.upload(file.path , {
                    folder: 'Doctor_appointent_system/Prescriptions',
                    public_id:path.basename(file.filename),
                    resource_type:'raw'
                })
        



        if (!upload) {
            fs.rm(file.path)
            logging.critical("file not upload, somthing error!")
            return next(new appError("file not upload, somthing error!",400))
        }
        
        
                 findPaitent.prescription.url_link = upload.url
                 findPaitent.prescription.prescription_id = upload.public_id
        
        await findPaitent.save()

        
        await sendCommanMails(
            findPaitent.patientEmail,
            "Thank You for Your Appointment - Prescription Attached",
            `<h4>Dear ${findPaitent.patientName}</h4>

            <p>I hope this message finds you well.<br>
            Thank you for your recent appointment with us. As discussed, I have attached the prescription for ${findPaitent.patientName} to this email.</p>
            
            <p>If you have any questions or need further assistance, please do not hesitate to reach out.<br>
            Thank you once again for choosing our services.</p>
                    
            <p>Best regards,<br>
            "JP Hospital"<br>
            +91 9998881221</p>`,
            file
        )
        
        
        fs.rm(file.path)
        
        
        res.status(200).json({
            code:1,
            msg:"file upload & email send successfully!",
            data:findPaitent
        })


      } catch (error) {
        fs.rm(file.path)
        logging.critical(error)
        return next(new appError(
            error
        ))
        
      }
       

}
const updateDoctorProfile = async(req,res,next)=>{

        const {id} = req.userData || req.query

    try{

        if (req.file) {

                const upload = await cloudinary.uploader.upload(path.resolve(req.file.path) , {
                    folder:"Doctor_appointent_system/usersProfiles",
                    width: 200,
                    height: 200, 
                    crop: 'fill',
                    gravity: 'face',
                    public_id: path.basename(req.file.filename)
                })

            if (!upload) {
                logging.info("profile not upload try again")
                return next(new appError("profile not upload and update try again",400))
            }


            fs.rm(path.resolve(req.file.path))


            req.body["avatar"] = {
                url_link:upload.secure_url ,
                avatar_id:upload.public_id
            }

        }

        const userAndUpdate = await doctorModel.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )


    if (!userAndUpdate) {
        logging.info("user not update!")
        return next(new appError("user not update!",400))
    }

    res.status(200).json({
        code:1,
        msg:"user update successfully!",
        date:Date.now(),
        data:userAndUpdate
    })


    } catch (error) {
        logging.critical(error)
        return next(new appError(error,500))
    }

}
export {
    register,
    cancelAppoinment,
    residual,
    sendPrescription,
    updateDoctorProfile
}