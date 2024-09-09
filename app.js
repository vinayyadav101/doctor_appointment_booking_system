import express from "express";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middelwares/errohandling.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import bodyParser from "body-parser";
import dbConnection from "./config/dbConnection.js";
import doctorRouter from "./routes/doctor.routes.js";
import logging from "./config/logfileConfig.js";
import 'dotenv/config'
import cron from "./utils/checkAppoinmentStatus.js";
import searchRoutes from "./routes/search.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import adminRoutes from "./routes/admin.routes.js";



const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:true
}))






app.use('/api/v1/user' , userRoutes)
app.use('/api/v1/doctor' , doctorRouter)
app.use('/api/v1/search' , searchRoutes)
app.use('/api/v1/payment' , paymentRoutes)
app.use('/api/v2/admin' , adminRoutes)



app.all('/*' ,(req,res)=>{
    res.send("opps!")
})

app.use(errorHandler)

export default app;