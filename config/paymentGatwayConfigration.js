import Razorpay from 'razorpay'
import 'dotenv/config'

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
})

export default razorpay;

