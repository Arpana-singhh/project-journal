import mongoose from 'mongoose';
import crypto from 'crypto';

const inviteLinkSchema = new mongoose.Schema(
    {
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project',
            required:true,
        },
        token:{
            type:String,
            required:true,
            unique:true,
            default:()=>crypto.randomBytes(24).toString('hex'),
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        expiresAt:{
            type:Date,
            required:true,
        },
        maxMembers:{
            type:Number,
            default:null,
        },
        memberCount:{
            type:Number,
            default:0,
        },
    }, {
        timestamps:true,
        toJSON:{
            transform:(doc, ret)=>{
                ret.inviteLinkId = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

const inviteLinkModel = mongoose.models.InviteLink || mongoose.model("InviteLink", inviteLinkSchema);

export default inviteLinkModel;
