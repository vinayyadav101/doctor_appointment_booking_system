import cron from 'node-cron'
import appointmentModel from '../models/appointmentSchema.js';




cron.schedule('* * * * * *' , async() => {
    
    const timeOut = new Date().getTime() - 600 * 1000;
    
         const findeAppointments = await appointmentModel.find({
            status:"booked",
            createdAt:{$lte : timeOut}
         })
         
        findeAppointments.forEach(async(data) => {
            await appointmentModel.findByIdAndDelete(data._id)
         })
})


export default cron;