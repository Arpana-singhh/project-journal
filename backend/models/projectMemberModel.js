import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema(
    {
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project',
            required:true,
        },
        memberId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        role:{
            type:String,
            enum:['owner', 'editor'],
            default:'editor',
        },
        joinedAt:{
            type:Date,
            default:Date.now,
        },
    }, {
        toJSON:{
            transform:(doc, ret)=>{
                ret.projectMemberId = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

projectMemberSchema.index({ projectId: 1, memberId: 1 }, { unique: true });
// Supports "find all projects a user belongs to" - the compound index above
// can't serve a memberId-only query since memberId isn't its leftmost field.
projectMemberSchema.index({ memberId: 1 });

const projectMemberModel = mongoose.models.ProjectMember || mongoose.model("ProjectMember", projectMemberSchema);

export default projectMemberModel;
