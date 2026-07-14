import express from "express";
import connectDB from "./config/mongodb.js";
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json({ limit: "5mb" }));

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', inviteRoutes);


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`)
    })
})

