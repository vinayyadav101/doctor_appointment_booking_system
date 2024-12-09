import { Router } from "express";
import { cancelAppoinment, getAvailableDateAndTime, register, residual, sendPrescription, updateDoctorProfile } from "../controllers/doctorController.js";
import { authRole, userAuth } from "../middelwares/userAuth.js";
import { upload, uploadPdf } from "../middelwares/multer.js";


const doctorRouter = Router()

doctorRouter.post("/register" , userAuth , authRole("admin"), register)
doctorRouter.get("/avilabletime/:id", getAvailableDateAndTime)


doctorRouter.put('/cancelappointment/:id', userAuth , authRole("doctor"),cancelAppoinment)
doctorRouter.put('/residual/:id', userAuth , authRole("doctor"),residual)

doctorRouter.put('/updateprofile', userAuth , authRole("doctor","admin") ,upload.single('avatar'), updateDoctorProfile)

doctorRouter.put('/sendprescription' , userAuth , authRole("doctor"),uploadPdf.single('Prescription'), sendPrescription)




export default doctorRouter