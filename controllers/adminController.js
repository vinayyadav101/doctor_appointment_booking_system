import doctorModel from "../models/doctorSchema.js"
import appointmentModel from "../models/appointmentSchema.js";
import appError from "../utils/error.util.js";
import logging from "../config/logfileConfig.js";
import paymentModel from "../models/paymentSchema.js"
import userModel from "../models/userSchema.js";


const deleteDoctor = async(req,res,next)=>{
        const {id} = req.params

    if (!id) {
        logging.debug("invalid doctor id")
        return next(new appError("invalid doctor id",400))
    }

    try {
            const deletedDoctor = await doctorModel.findByIdAndDelete(id)

        if (!deletedDoctor) {
            logging.debug("not delete doctor, somthing tachnical error")
            return next(new appError("not delete doctor, somthing tachnical error",500))
        }

        req.email = deletedDoctor.email
        req.params.id = undefined
        next()
       

    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }


}

const paymentCollection = async(req,res,next) => {
    try {
            const payments = await paymentModel.find()
        
        if (payments.length === 0) {
            logging.error("no found any payments")
            return next(new appError("no found any payments",400))
        }

        res.status(200).json({
            code:1,
            msg:"all payment fetch successfully",
            date:Date.now(),
            data:payments
        })

    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

const allAppointments = async(req,res,next)=>{

    try {
            const appointments = await appointmentModel.find()

        if (appointments.length === 0) {
            logging.debug("not found any appoinments")
            return next(new appError("not found any appoinments" , 404))
        }

        res.status(200).json({
            code:1,
            msg:"get all appointments",
            date:Date.now(),
            data:appointments
        })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

const getAllDoctors = async(req,res,next) => {
    try {
        const doctor_list = await doctorModel.find()

        if (doctor_list.length === 0) {
            logging.debug("smothing error in fetch data")
            return next(new appError("smothing error in fetch data",404))
        }
        res.status(200).json({
            code:1,
            msg:"find doctor list successfully",
            date:Date.now(),
            data:doctor_list
        })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}
const getAllUser = async(req,res,next)=>{
    try {
        const user_list = await userModel.find()

        if (user_list.length === 0) {
            logging.debug("smothing error in fetch data")
            return next(new appError("smothing error in fetch data",404))
        }
        res.status(200).json({
            code:1,
            msg:"find doctor list successfully",
            date:Date.now(),
            data:user_list
        })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}
const deleteUser = async(req,res,next,)=>{


        const {id} = req.params;
        const email = req.email
        let deletedUser;



    try {
        if (!id === undefined) {
            deletedUser = await userModel.findByIdAndDelete(id)

        if (!deletedUser) {
            logging.debug("not delet user, somthing tachnical error")
            return next(new appError("not delet user, somthing tachnical error",500))
        }

        } else if (email) {
                deletedUser = await userModel.findOneAndDelete({email})


            if (!deletedUser) {
                logging.debug("doctor data was delete but doctor not register as user")
                return next(new appError("doctor data was delete but doctor not register as user",500))
            }
        }else{
            logging.error("not find id and email , somting worng")
            return next(new appError("not find id and email , somting worng",500))
        }

    res.status(200).json({
        code:1,
        msg:"user delete successfully!",
        date:Date.now(),
        data:deletedUser
    })
    } catch (error) {
        logging.error(error)
        return next(new appError(error , 500))
    }

}



export {
    deleteDoctor,
    paymentCollection,
    allAppointments,
    deleteUser,
    getAllUser,
    getAllDoctors
}