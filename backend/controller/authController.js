import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const login = async(req, res)=>{
const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false, message:"Email and Password are required"})
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message: "Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        if (!user.isAccountVerified) {
            user.isAccountVerified = true;
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success:true,
            message:"Login Successful",
            token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                avatar:user.avatar,
                isAccountVerified:user.isAccountVerified

            }
        })
    } 
    catch(error){
        console.error("Login Error", error);
        return res.status(500).json({success:false, message:error.message});
    }
}

export const register = async (req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try{
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists with this email" });
        } 

        const hashdPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({name, email, password:hashdPassword});

        return res.status(201).json({
            success: true,
            message: "Account created. Please verify your email with the OTP sent.",
            user: {
                name: user.name,
                email: user.email,
            },
        });

    }
    
    catch(error){
        console.error("Register Error", error);
        return res.status(500).json({success:false , message:error.message});
    }
}
