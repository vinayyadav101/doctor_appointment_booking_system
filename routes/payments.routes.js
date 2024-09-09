import { Router } from "express";
import { createOrder, verifyOrder } from "../controllers/paymentController.js";

const paymentRoutes = Router();


paymentRoutes.post('/createorder' , createOrder)
paymentRoutes.post('/verifypayment' , verifyOrder)


export default paymentRoutes