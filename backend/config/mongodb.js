import mongoose from 'mongoose';

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
}

export default connectDB