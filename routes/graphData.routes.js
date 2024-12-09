import { Router } from "express";
import {AllDataInNumbers, appointmentStatus, appointmentUsers, departmentPortion, paymentCollection} from "../utils/graph.js";
import { authRole, userAuth } from "../middelwares/userAuth.js";

const graphData = Router()

graphData.get('/appointmentUsers', userAuth , authRole("admin") ,appointmentUsers)
graphData.get('/appointmentStatus', userAuth , authRole("admin") ,appointmentStatus)
graphData.get('/paymentCollection', userAuth , authRole("admin") ,paymentCollection)
graphData.get('/departmentPortion', userAuth , authRole("admin") ,departmentPortion)
graphData.get('/AllDataInNumbers', userAuth , authRole("admin") ,AllDataInNumbers)

export default graphData