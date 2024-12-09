import doctorModel from "../models/doctorSchema.js"
import appointmentModel from "../models/appointmentSchema.js";
import appError from "../utils/error.util.js";
import logging from "../config/logfileConfig.js";
import paymentModel from "../models/paymentSchema.js"
import userModel from "../models/userSchema.js";
import razorpay from "../config/paymentGatwayConfigration.js"


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
            const payments = await paymentModel.find().sort({createdAt: -1})
        
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
            const appointments = await appointmentModel.find().sort({createdAt: -1})

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


const deleteUser = async(req,res,next,)=>{


        const {id} = req.params;
        const email = req.email
        let deletedUser;



    try {
        if (id) {
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
const appointmentFindById = async(req,res,next)=>{
    const id = req.params.id



        if (!id) {
            return next(new appError(500,'enter Id'))
        }
    try {

        
            const payment = await appointmentModel.findById(id)


                if (payment === null) {
                    return next(new appError('appointment details not find by this id.',404))
                }
            res.status(200).json({
                code:1,
                date:Date.now(),
                msg:"appointment details find successfully.",
                data:payment
            })
    } catch (error) {
        return next(new appError(error,500))
    }
}
const getUser = async(req,res,next)=>{
    const email = req.params.email
    try {
        const user = await userModel.findOne({email:email}).select('+password')

        if (!user) {
            logging.error('user not fond by this email.')
            return next(new appError('user not fond by this email.',404))
        }
        res.status(200).json({
            code:1,
            msg:'user find successfully',
            date:Date.now(),
            data:user
        })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}



export {
    deleteDoctor,
    paymentCollection,
    allAppointments,
    deleteUser,
    appointmentFindById,
    getUser
}