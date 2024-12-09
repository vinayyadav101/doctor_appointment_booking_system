import { Router } from "express";
import { allAppointments, appointmentFindById, deleteDoctor, deleteUser, getUser, paymentCollection } from "../controllers/adminController.js";
import { authRole, userAuth } from "../middelwares/userAuth.js";


const adminRoutes = Router()

adminRoutes.get('/appointments',userAuth , authRole("admin"),allAppointments)
adminRoutes.get('/payments',userAuth , authRole("admin"),paymentCollection)
adminRoutes.delete('/deleteuser/:id',userAuth , authRole("admin"),deleteUser)
adminRoutes.delete('/deletedoctor/:id',userAuth , authRole("admin") , deleteDoctor , deleteUser)
adminRoutes.get('/appointment/:id',userAuth , authRole("admin"),appointmentFindById )
adminRoutes.get('/user/:email',userAuth , authRole("admin"),getUser )



export default adminRoutes