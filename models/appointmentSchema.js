import mongoose, { Schema } from "mongoose";


const appointmentSchema = new Schema(
    {
        patientName:{
            type:"string",
            required:true,
            minlength : 3,
            maxlength : 20,
            trime : true
        },
        patientEmail:{
            type:"string",
            required:true,
            lowercase : true,
            trime: true
        },
        phone:{
            type:"Number",
            required:true,
            maxlength:[10, 'phone number legnth must be lesten and equal 10'],
            trime:true
        },
        department:{
            type:"string",
            default:"genral",
            required:true,
            lowercase : true,
            trime: true
        },
        doctorName:{
            type:"string",
            required:true,
            lowercase : true,
            trime: true
        },
        doctorID:{
            type:"string",
            required:true,
            select:false
        },
        order_id:{
            type:"string"
        },
        bookedDateTime:{
            date:{
                type:"string"
            },
            time:{
                type:"string"
            }
        },
        residual:{
            date:{
                type:"string",
                default:null
            },
            time:{
                type:"string",
                default:null
            }
            
        },
        status:{
            type:"string",
            emum:["booked","confirm"],
            default:"booked"
        },
        prescription:{
            url_link:{
                type:"string",
                default:null
            },
            prescription_id:{
            type:"string",
            default:null
            }
        }
    },
    {
        timestamps:true
    }
)

const appointmentModel = mongoose.model('appointments' , appointmentSchema)

export default appointmentModel;