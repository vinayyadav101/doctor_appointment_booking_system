
import logging from "../config/logfileConfig.js"
import razorpay from "../config/paymentGatwayConfigration.js"
import appointmentModel from "../models/appointmentSchema.js"
import doctorModel from "../models/doctorSchema.js"
import paymentModel from "../models/paymentSchema.js"
import appError from "../utils/error.util.js"
import crypto from 'crypto'



const createOrder = async(req,res,next) =>{
    
            const {doctorID , appointmentID} = req.ids
            const {consultaionFee} = await doctorModel.findById(doctorID)


       try {
                const order = await razorpay.orders.create({
                                    amount:(consultaionFee*100).toString(),
                                    currency:"INR",
                                })


            if (!order) {
                logging.error("oreder not crated")
                return next(new appError("oreder not crated",400))
            }


            await appointmentModel.findByIdAndUpdate(appointmentID , {
                "order_id":order.id
            })

            res.json({
                code:1,
                msg:"order create succsessfully",
                date:Date.now()
            })
       } catch (error) {
            logging.error(error)
            return next(new appError(error,500))
       }
}

const verifyOrder = async(req,res,next) => {

        const {payment_id , order_id , signature , appointmentID} = req.body

        const appointment = await appointmentModel.findById(appointmentID)

    if (!appointment) {
         logging.error("appointment details not found!")
        return next(new appError("appointment details not found",400))
    }

    try {
            const genratedSignatureID =  crypto.createHmac('sha256' , process.env.KEY_SECRET)
                                                .update(appointment.order_id +'|'+ payment_id)
                                                .digest('hex')


        if (genratedSignatureID !== signature) {
            logging.info("signateure not match somthing error")
            return next(new appError("signateure not match somthing error" , 400))
        }

        await paymentModel.create({
            payment_id,
            order_id,
            signature,
            appointment_id:appointmentID
        })

        appointment.status = "confirm"

        await appointment.save()


        res.status(200).json({
            code:1,
            msg:"your payment verify suucessfully",
            date:Date.now(),
            data:null
        })


    } catch (error) {
         logging.error(error)
        return next(new appError(error,500))
    }
}

export {
    createOrder,
    verifyOrder
}