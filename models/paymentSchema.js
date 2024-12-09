import {mongoose, Schema } from "mongoose";


const paymentSchema = new Schema(
    {
        payment_id:{
            type : 'string',
            required: true
        },
        order_id : {
            type : 'string',
            required: true
        },
        signature : {
            type : 'String',
            required: true
        },
        appointment_id: {
            type: 'string',
            required: true
        },
        amount:{
            type:'number',
            require:true
        },
        refund:{
            type:"number",
            default:undefined
        }
    },
    {
        timestamps: true
    }
);

const paymentModel = mongoose.model('payments' , paymentSchema)

export default paymentModel