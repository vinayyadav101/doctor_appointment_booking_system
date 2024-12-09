import razorpay from "../config/paymentGatwayConfigration.js"
import appointmentModel from "../models/appointmentSchema.js"
import doctorModel from "../models/doctorSchema.js"
import paymentModel from "../models/paymentSchema.js"
import userModel from "../models/userSchema.js";
import appError from "./error.util.js"
import logging from "../config/logfileConfig.js";



const appointmentUsers = async(req,res,next)=>{
    try {
        const appointment = await appointmentModel.find()


        if (!appointment) {
            logging.critical('error in database check connection.')
            return next(new appError('error in database check connection.',500))
        }
        
        
        const monthlyData = {};
        const seenEmails = new Set(); 

    appointment.forEach(({ createdAt, patientEmail }) => {
        const month = new Date(createdAt).toISOString().slice(0, 7); 

        
            if (!monthlyData[month]) {
                monthlyData[month] = { newUsers: 0, oldUsers: 0 };
            }

            if (!monthlyData[month].emails) {
                monthlyData[month].emails = new Set();
            }

            if (monthlyData[month].emails.has(patientEmail)) return;

            
            monthlyData[month].emails.add(patientEmail);

        
            if (seenEmails.has(patientEmail)) {
                monthlyData[month].oldUsers += 1;
            } else {
                monthlyData[month].newUsers += 1; 
                seenEmails.add(patientEmail);
            }

    });
    
    Object.keys(monthlyData).forEach((month) => {
        delete monthlyData[month].emails;
    });


    const data = Object.entries(monthlyData).map(([month, { newUsers, oldUsers }]) => [month, newUsers, oldUsers]);

        res.status(200).json({
            code:1,
            date:Date.now(),
            msg:"success",
            data:data
        })
    } catch (error) {
        return next(new appError(error,500))
    }
}

const appointmentStatus = async(req,res,next)=>{
    try {
        
        const status = await appointmentModel.find()

        if (!status) {
            logging.critical('error in database check connection.')
            return next(new appError('error in database check connection.',500))
        }

        const monthlyData = {}
        status.forEach(({createdAt,status})=>{
            
            const month = new Date(createdAt).toISOString().slice(0,7) // Extract YYYY-MM format
        
            
            if (!monthlyData[month]) {
                monthlyData[month] = {confirm:0,cancel:0}
            }
            if (status !== 'confirm') {
                monthlyData[month].cancel += 1
            }else{
                monthlyData[month].confirm += 1
            }
        })

        const data = Object.entries(monthlyData).map(([month,{confirm,cancel}])=>[month,confirm,cancel])

        res.status(200).json({
            code:1,
            date:Date.now(),
            msg:'success',
            data:data
        })


    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

const paymentCollection = async(req,res,next)=>{
    try {
        const payment = await paymentModel.find()

        if (!payment) {
            logging.critical('error in database check connection.')
            return next(new appError('error in database check connection.',500))   
        }

        const monthlyData = {}
            payment.forEach(({createdAt , amount})=>{
                const  month = new Date(createdAt).toISOString().slice(0,7)
                    if (!monthlyData[month]) {
                        monthlyData[month] = 0
                    }
                    monthlyData[month] += amount

            })


        const data = []

            for (const key in monthlyData) {
                data.push([key , monthlyData[key]])
            }
            

        res.status(200).json({
            code:1,
            date:Date.now(),
            msg:"success",
            data:data
        })
        
        
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
        
    }
}
const departmentPortion = async(req,res,next)=>{
    try {

        const appointment = await appointmentModel.find()
        
            if (!appointment) {
                logging.critical('error in database check connection.')
            return next(new appError('error in database check connection.',500))
            }
        
        let result = {}

            appointment.forEach(el => {
    
                if (!result[el.department]) {
                    result[el.department] = 0
                }
                    result[el.department] += 1
            })
        result = Object.entries(result).sort((a,b)=>b[1]-a[1])
            if (result.length > 5) {
                const outher = ['outher',0]
                    for (let i = 5; i < result.length; i++) {
                        outher[1] += result[i][1]
                    }
                result.splice(5 , result.length - 5 , outher)
                
            }
            result.splice(0 , 0 , ['department','total appointments'])

            res.status(200).json({
                code:1,
                date:Date.now(),
                msg:"success",
                data:result
            })

    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}
const AllDataInNumbers = async(req,res,next)=>{
    try {
        const appointments = await appointmentModel.find()
        const users = await userModel.find()
        const payments = await paymentModel.find()
        const doctors = await doctorModel.find()

            if (!appointments || !users || !payments || !doctors) {
                logging.critical('error in database check connection.')
                return next(new appError('error in database check connection.',500))
            }

        const data ={
            appointment:0,
            canceledAppointment:0,
            completedAppointment:0,
            user:0,
            doctor:0,
            payment:0,
            refundpayment:0
        }
        
        
        let existDoctorInUser = 0
                 users.forEach((el)=>{
                    if (el.role === 'doctor') {
                        existDoctorInUser +=1
                    }
                })
                appointments.forEach(el=>{
                    if (el.status === 'confirm') {
                        data.completedAppointment += 1
                    }else if (el.status === 'cancel') {
                        data.canceledAppointment +=1
                    }
                })
                payments.forEach((el)=>{
                    if (el.amount !== undefined) {
                        data.payment += el.amount
                    }else if(el.refund !== undefined){
                        data.refundpayment += el.amount
                    }
                })
                    
            data.appointment = appointments.length
            data.user = users.length - existDoctorInUser
            data.doctor = doctors.length

        res.status(200).json({
            code:1,
            date:Date.now(),
            msg:"success",
            data:data
        })
            

    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}



export {
    appointmentUsers,
    appointmentStatus,
    paymentCollection,
    departmentPortion,
    AllDataInNumbers
    }




