import mongoose from "mongoose"
import logging from "./logfileConfig.js";


const dbConnection = async()=>{

    await mongoose.connect(process.env.MONGODB_URL)
            .then(()=>{
                logging.info("databacse connection successfully.")
            })
            .catch((error)=>{
                logging.warning('database not connected!', error)   
            })
}

export default dbConnection;