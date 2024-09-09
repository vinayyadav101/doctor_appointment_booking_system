import doctorModel from "../models/doctorSchema.js"
import logging from "../config/logfileConfig.js";
import appError from "../utils/error.util.js";
import userModel from "../models/userSchema.js";
import paymentModel from "../models/paymentSchema.js";
import appointmentModel from "../models/appointmentSchema.js";

const search = async(req,res,next) => {

        const {collect} = req.query;


        
    if (!collect) {
        logging.info("please provide doctor name and speciality ,somthing else")
        return next(new appError("please provide doctor name and speciality ,somthing else" , 400))
    }
    try {
            const data = await doctorModel.find({
                $or:[
                    {
                        doctorName : {
                            $regex:collect
                    }
                    },
                    {
                        specialty:{
                            $regex:collect
                    }
                    }
                ]
            })

        if (data.length === 0) {
            logging.info("data not found")
            return next(new appError("data not found",404))
        }

        res.status(200).json({
            code:1,
            msg:"data finde",
            date:Date.now(),
            data:data
        })
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

const searchWithFillter = async(req,res,next) =>{

        const {experience , consultaionFee}= req.body
        

    try {
            let fillter;
        
        if (!experience) {
            fillter = {
                consultaionFee:{$lte:consultaionFee}
            }
        }else if (!consultaionFee) {
            fillter = {
                experience:{$gte:experience}
            }
        }else {
            fillter = {
                $and:[
                    {consultaionFee:{$lte : consultaionFee}},
                    {experience:{$gte:experience}}
                ] 
            }
        }


            const fillterData = await doctorModel.find(fillter)
            



        if (fillterData.length === 0) {
            logging.info("no data found!")
            return next(new appError("no data found!" , 404))
        }
            


        res.status(200).json({
            code:1,
            date:Date.now(),
            msg:"data finde",
            data:fillterData
        })

        
    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }

}

const getMoredata = async(req,res,next)=>{

    const databaseName = [userModel,doctorModel,paymentModel,appointmentModel]
    const request = req.query
    

    
    try {
        databaseName.forEach(async(el)=>{
            
            if (el.modelName === Object.keys(request).toString()) {

                        const data = await el.find().skip(Number(Object.values(request))).limit(10)

                    if (data === 0) {
                        logging.info("not get more data")
                        return next(new appError("not get more data",404))
                    }
                    res.status(200).json({
                        code:1,
                        msg:"fetched data successfully",
                        date:Date.now(),
                        data:data
                    }) 
            }
        })


    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

const topThreeDoctor = async(req,res,next)=>{

    try {
        const doctors_list = await doctorModel.find().select("+review")

         doctors_list.forEach(element => {
            element.fiveStarCount = element.review.filter(review => review.rating === 5).length;
            element.fourStarCount = element.review.filter(review => review.rating === 4).length;
            element.threeStarCount = element.review.filter(review => review.rating === 3).length;
            element.twoStarCount = element.review.filter(review => review.rating === 2).length;
            element.oneStarCount = element.review.filter(review => review.rating === 1).length;
             
        })
        
        doctors_list.sort((a,b)=>{
            if (b.fiveStarCount !== a.fiveStarCount) {
            return b.fiveStarCount - a.fiveStarCount;
          } else if (b.fourStarCount !== a.fourStarCount) {
            return b.fourStarCount - a.fourStarCount;
          } else if (b.threeStarCount !== a.threeStarCount) {
            return b.threeStarCount - a.threeStarCount;
          } else if (b.twoStarCount !== a.twoStarCount) {
            return b.twoStarCount - a.twoStarCount;
          } else {
            return b.oneStarCount - a.oneStarCount;
          }})

        const topThreeDoctors = doctors_list.slice(0,3)
        
        res.status(200).json({
            data:topThreeDoctors
        })

    } catch (error) {
        logging.error(error)
        return next(new appError(error,500))
    }
}

export {
    search,
    searchWithFillter,
    getMoredata,
    topThreeDoctor
}