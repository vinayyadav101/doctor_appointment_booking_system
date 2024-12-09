import { Router } from "express";
import { createOrder, paymentFindByID, verifyOrder } from "../controllers/paymentController.js";

const paymentRoutes = Router();


paymentRoutes.post('/createorder' , createOrder)
paymentRoutes.post('/verifypayment' , verifyOrder)

paymentRoutes.get('/payment/:id',paymentFindByID)


export default paymentRoutes