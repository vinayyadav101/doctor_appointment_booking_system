import {v2 as cloudinary} from "cloudinary"
import 'dotenv/config'
import logging from "./logfileConfig.js"

const cloudnairyConnection = (next)=>{
    
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure : true
        })
        if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
            logging.error('please check cloudniry conection configration')
        }else{
            logging.info('cloudniry connection success');
        }
        
    
}

export default cloudnairyConnection