import logging from "../config/logfileConfig.js";
import userModel from "../models/userSchema.js";
import appError from "../utils/error.util.js";
import bcrypt from 'bcrypt'
import { otps, sendOtp } from "../utils/sendOtp.utils.js";
import doctorModel from "../models/doctorSchema.js"
import appointmentModel from "../models/appointmentSchema.js";
import {v2 as cloudinary}  from 'cloudinary'
import path from 'path'
import fs from 'fs/promises'



const cookieOptions = {
    httpOnly:true,
    maxAge: 24 * 60 * 60 *1000
};




const register = async(req,res,next)=>{
    
        const { userName , email , password , phone} = req.body;

    if (!email || !password || !phone) {
         logging.error("All fields are required")
         return next(new appError("All fields are required",400))
    }
        let userDetails = {
            userName,
            email,
            password,
            phone
        }


    
    try {
            const emailFind = await userModel.findOne({email})
            const doctorDetails = await doctorModel.findOne({email})

        if (emailFind) {
            logging.info("email alrady registerd")
            return next(new appError("email alrady registerd",400))
        }else if (doctorDetails) {
            userDetails["doctorId"] = doctorDetails._id;
            userDetails["role"] = 'doctor'
        }
        
              const user = new userModel(userDetails)

        
        await user.save()

            user.password = undefined;

            const token = user.JWTtoken()

        res.cookie("token" , token ,cookieOptions)

        res.status(200).json({
            code:1,
            msg:"user register successfully",
            time:Date.now(),
            data: user
        })


    } catch (error) {
        logging.error(error || "error in register")
        return next(new appError(error,500))
    }

}
const login = async(req,res,next)=>{

        const { email , password } = req.body;
    
    if (!email || !password) {
        logging.error("input all fildes")
        return next(new appError("input all fildes",400))
    }

        const user = await userModel.findOne({email}).select('+password')
    if (!user) {
        logging.info("this email not exist!")
        return next(new appError("this email not exist!",400))
    }
    if (!(await bcrypt.compare(password,user.password ))) {
         logging.error('password error!')
         return next(new appError('password error!',400))
    }
       const token = user.JWTtoken()

     res.cookie('token' , token , cookieOptions)

        user.password = undefined;

    res.status(200).json({
        code:1,
        msg:"user login successfully",
        time:Date.now(),
        data:user
    })
    

}
const logout = async(req ,res,next)=>{
    
    res.cookie('token' , '' ,{maxAge: new Date(0)})

    res.status(200).json({
        code:1,
        msg:"user logout!",
        time:Date.now(),
        data:null
    })
}
const getUserDetails = async(req,res,next)=>{

    const {id} = req.userData;

    try {
            if (req.userData.role === 'doctor') {
                    const doctorDetails = await doctorModel.find({email:req.userData.email}).select("+review")

                if (doctorDetails.length === 0) {
                    logging.info("doctor detail not dound")
                    return next(new appError("doctor detail not dound",404))
                }
                res.status(200).json({
                    code:1,
                    msg:"user finded",
                    time:Date.now(),
                    data:doctorDetails
                })
            }else{
                    const user = await userModel.findById(id)
                if (!user) {
                    logging.info("user not found by this id")
                    return next(new appError("user not found by this id",404))
                }
                res.status(200).json({
                    code:1,
                    msg:"user finded",
                    time:Date.now(),
                    data:user
                })
            }

        
    } catch (error) {
        logging.error(error || "error in getuserDetails")
        return next(new appError(error,500))
    }
    

}
const forgetPassword = async(req,res,next)=>{


        const {email} = req.body;

    try {
            const user = await userModel.findOne({email})


        if (!user) {
            logging.error('not valid email address')
            return next(new appError('not valid email address'))
        }


        await sendOtp(email)
            
            res.status(200).json({
                code:1,
                msg:"otp send successfully",
                time:Date.now()
            })
            
    } catch (error) {
        logging.error(error || "error in forgotpassword")
        return next(new appError(error,500))
    }

}
const resetPassword = async(req,res,next)=>{

        const {email , otp , newPassword} = req.body;

        const user = await userModel.findOne({email}).select("+password")

    if (!user) {
        logging.critical("somthing wrong in resetpassword")
        return next(new appError("somthing wrong in resetpassword",400))
    }
    
    if (!(otps[email] === otp)) {
        logging.error("worng otp and emial")
        return next(new appError("worng otp and emial",400))
    }

    try {

        user.password = newPassword

        await user.save()

        delete otps[email]
        
        res.status(200).json({
            code:1,
            msg:"password change successfully",
            time:Date.now()
        })

    } catch (error) {
        logging.error(error || "error in resetpassword")
        return next(new appError(error,500))

    }

}
const changePassword = async(req,res,next)=>{
        const {oldPassword , newPassword} = req.body;
        const {id} = req.userData;


    if(!id){
        logging.error("somthing wrong on logoin")
        return next(new appError("somthing wrong on logoin",400))
    }

    try {
            const user = await userModel.findById(id).select("+password")

        if (!(await bcrypt.compare(oldPassword,user.password ))) {
             logging.error('oldpassword not same!')
            return next(new appError('oldpassword not same!',400))
        }
    
        user.password = newPassword;
        await user.save()
        user.password = undefined

        res.status(200).json({
            code:1,
            msg:"pssword changed successfully",
            time:Date.now(),
            data:user
        })
    } catch (error) {
        logging.error(error || "error in changepassword")
        return next(new appError(error,500))
    }
    
}

const appointment = async(req,res,next) => {

        const doctorID = req.params.id;
        const {patientName , patientEmail  , doctorName  , bookedDateTime , phone} = req.body; 




    if(!patientEmail || !patientName ||!doctorName || !bookedDateTime || !phone){
        logging.info("required filed please fillup!")
        return next(new appError("required filed please fillup!",400))
    }


    const bookingDateTime = new Date(`${bookedDateTime.date} ${bookedDateTime.time}`);
    const currentDateTime = new Date(new Date().toISOString().slice(0,17) + '00.000Z')


    if (!(bookingDateTime >= currentDateTime)) {
        logging.info("you are not able to previous time and date")
        return next(new appError("you are not able to previous time and date",400))
    }


        const doctorSchedule = await appointmentModel.find({doctorID})
        const department = await doctorModel.findById(doctorID , {specialty:true})


        const time = doctorSchedule.filter((value) => {
            return value.bookedDateTime.date === bookedDateTime.date
        }).map(value => value.bookedDateTime.time)
        



    if (time.includes(bookedDateTime.time)) {
            logging.info("this time alredy booked")
            return next(new appError("this time alredy booked",400))
    }
    


        try {
                const appointmentDetails = await appointmentModel.create({
                    patientName,
                    patientEmail,
                    doctorName,
                    bookedDateTime,
                    department:department.specialty,
                    doctorID,
                    phone
                })
                .then((data) =>{ 
                     req.ids = {
                        appointmentID:data._id,
                        doctorID
                    }
                        next()
                })
                .catch(error => {
                    logging.error(error)
                    return next(new appError(error))
                })


        } catch (error) {
            logging.error(error || "appoinment error")
            return next(new appError(error))
        }
}

const appointmentHistory = async(req,res,next)=>{


        const {email,doctorId} = req.userData;



    if (!email) {
        logging.error("user not loging")
        return next(new appError("user not loging",400))
    }



        try {
            let history;


                 if (req.userData.role === "user") {
                    history = await appointmentModel.find({patientEmail:email},{
                        doctorName:1,
                        department:1,
                        bookedDateTime:1,
                        order_id:1,
                        residual:1,
                        status:1,
                        prescription:1

                    })
                    
                 }else{
                    history = await appointmentModel.find({doctorID:doctorId},{
                        patientEmail:1,
                        patientName:1,
                        phone:1,
                        bookedDateTime:1,
                        residual:1,
                        prescription:1
                    })
                 }



            if (history.length === 0) {
                logging.error("there is no appointment history!")
                return next(new appError("there is no appointment history!",400))
            }


            res.status(200).json({
                code:1,
                msg:"successfully fide history",
                time:Date.now(),
                data:history
            })


        } catch (error) {
            logging.error(error || "appointment history error")
            return next(new appError(error,500))
        }

}

const review = async(req,res,next)=>{

        const {id} = req.params;

        const { patientEmail ,rating , review} = req.body;



        const doctor = await doctorModel.findById(id).select("+review")



        const reviewData = doctor.review.filter(value=>value.patientEmail === patientEmail)



    if (reviewData.length !== 0) {
         logging.info("you alrady rating submit")
         return next(new appError("you alrady rating submit",400))
    }

    if (!doctor) {
         logging.info("something wrong in usercontrollers review")
        return next(new appError("something wrong in usercontrollers review",400))
    }

    try {
        
            const update = doctor.review.push({
                patientEmail,
                rating,
                review
            })




        await doctor.save()


        res.status(200).json({
            code:1,
            msg:"review submited",
            date:Date.now(),
            data:null
        })



    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }

}

const updateProfile = async(req,res,next)=>{

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
        
        const userAndUpdate = await userModel.findByIdAndUpdate(
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
 

export{
    register,
    login,
    logout,
    getUserDetails,
    forgetPassword,
    resetPassword,
    changePassword,
    appointment,
    appointmentHistory,
    review,
    updateProfile
}