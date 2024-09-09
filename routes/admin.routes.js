import { Router } from "express";
import { allAppointments, deleteDoctor, deleteUser, getAllDoctors, getAllUser, paymentCollection } from "../controllers/adminController.js";
import { authRole, userAuth } from "../middelwares/userAuth.js";


const adminRoutes = Router()

adminRoutes.get('/appointments',userAuth , authRole("admin"),allAppointments)
adminRoutes.get('/payments',userAuth , authRole("admin"),paymentCollection)
adminRoutes.get('/users',userAuth , authRole("admin"),getAllUser)
adminRoutes.get('/doctors',userAuth , authRole("admin"),getAllDoctors)
adminRoutes.delete('/deleteuser/:id',userAuth , authRole("admin"),deleteUser)
adminRoutes.delete('/deletedoctor/:id',userAuth , authRole("admin") , deleteDoctor , deleteUser)




export default adminRoutes