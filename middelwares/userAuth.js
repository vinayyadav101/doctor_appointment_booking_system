import jwt from 'jsonwebtoken'
import appError from '../utils/error.util.js';
import logging from '../config/logfileConfig.js';

const userAuth = async(req,res,next)=>{

        const token = (req.cookies.token) || null;
    
    if (!token) {
        logging.info("cookies error")
        return next(new appError('somthing is worng' , 400))
    }

        const userDetails = jwt.verify(token , process.env.SECRET)

    req.userData = userDetails

        next()
}

const authRole = (...roles) => (req,res,next) =>{
    const curentRole = req.userData.role;
    

    if (!(roles.includes(curentRole))) {
        logging.info("you are not able to accsess")
        return next(new appError("you are not able to accsess",401))
    }


        next()
}

export {
    userAuth,
    authRole
}