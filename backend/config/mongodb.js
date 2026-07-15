import mongoose from 'mongoose';
import projectMemberModel from '../models/projectMemberModel.js';

const connectDB = async()=>{
   const mongoUrl = process.env.MONGODB_URI;

   if(!mongoUrl){
    throw new Error('Missing env var: MONGODB_URI');
   }

   mongoose.connection.on("connected", ()=>{
    console.log('Database Connected');
   })

   mongoose.connection.on("error", (err)=>{
    console.error('MongoDB connection error:', err);
   })

   await mongoose.connect(mongoUrl);

   // Drops stale indexes (e.g. a leftover projectId_1_userId_1 unique index from
   // before the memberId field was named memberId) and recreates the ones in the schema.
   await projectMemberModel.syncIndexes();
}

export default connectDB