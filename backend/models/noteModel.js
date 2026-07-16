import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        meetingId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Meeting',
            required:true,
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project',
            required:true,
        },
        authorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
    }, {
        timestamps:true,
        toJSON:{
            transform:(doc, ret)=>{
                ret.noteId = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

noteSchema.index({ meetingId: 1 });

const noteModel = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default noteModel;
