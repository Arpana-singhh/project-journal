import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
    {
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project',
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        meetingDateTime:{
            type:Date,
            required:true,
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        notesCount:{
            type:Number,
            default:0,
        },
    }, {
        timestamps:{ createdAt:true, updatedAt:false },
        toJSON:{
            transform:(doc, ret)=>{
                ret.meetingId = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

meetingSchema.index({ projectId: 1 });

const meetingModel = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

export default meetingModel;
