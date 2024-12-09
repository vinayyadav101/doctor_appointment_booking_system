import { Router } from "express";
import { appointment, appointmentHistory, changePassword, forgetPassword, getUserDetails, login, logout, register, resetPassword, review, updateProfile, verify} from "../controllers/userController.js";
import  { userAuth, authRole } from "../middelwares/userAuth.js";
import { createOrder } from "../controllers/paymentController.js";
import { upload } from "../middelwares/multer.js";
import { updateDoctorProfile } from "../controllers/doctorController.js";


const userRoutes = Router()





userRoutes.post('/register' , register)
userRoutes.post('/login' ,login)
userRoutes.get('/logout' , userAuth ,logout)


userRoutes.post('/forgetpassword' , forgetPassword)
userRoutes.post('/resetpassword' , resetPassword)
userRoutes.put('/changepassword' , userAuth ,changePassword)


userRoutes.get('/profile' , userAuth , getUserDetails)

userRoutes.put('/updateprofile/' , userAuth , upload.single("avatar") , updateProfile , updateDoctorProfile)



userRoutes.post('/appointment/:id', appointment , createOrder )
userRoutes.get('/' , userAuth ,authRole("user","doctor"), appointmentHistory )

userRoutes.get('/cookie_check' ,userAuth , verify)



userRoutes.post('/review/:id',review)






export default userRoutes