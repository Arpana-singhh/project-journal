import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        projectName:{
            type:String,
            required:true,
        },
        projectKey:{
            type:String,
            required:true,
            unique:true,
        },
        description:{
            type:String,
        },
        ownerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
    }, {
        timestamps:true,
        toJSON:{
            transform:(doc, ret)=>{
                ret.projectId = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

const projectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default projectModel;
