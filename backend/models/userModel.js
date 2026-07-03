import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:['owner', 'editor', 'viewer'],
            default:'viewer',
        },
        avatar:{
            type:String,
            default:'https://placehold.net/default.png'
        },
        isAccountVerified:{
            type:Boolean,
            default:false
        },
    }, {
        timestamps:true
    }
)

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;