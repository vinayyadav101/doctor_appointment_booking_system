import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const userSchema = new Schema(
    {
        userName : {
            type:'string',
            default:undefined,
            minlength : 3,
            maxlength : 20,
            trime : true
        },
        email:{
            type:"string",
            required : true,
            unique:true,
            lowercase : true,
            trime: true
        },
        phone:{
            type:'Number',
            maxlength:[10, 'phone number legnth must be lesten and equal 10'],
            trime:true
        },
        password:{
            type:"string",
            required : true,
            select : false
        },
        doctorId:{
            type:"string",
            default:undefined
        },
        avatar:{
            url_link:{
                type:"string",
                default:'https://res.cloudinary.com/dr3opwg7s/image/upload/v1733585563/account_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24_moucnt.svg'
            },
            avatar_id:{
                type:"string",
                default:undefined
            },
            
        },
        role:{
            type:'string',
            enum:['admin' , 'user','doctor'],
            default : 'user'
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre('save' , async function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password , 10)
        return next()
})

userSchema.methods={
    JWTtoken(){
        return jwt.sign(
            {id:this._id , email:this.email , role:this.role , doctorId: this.role === 'doctor'? this.doctorId : undefined},
            process.env.SECRET,
            {expiresIn: "24hr"}
        )
    }
}




const userModel = mongoose.model('users' , userSchema)

export default userModel;