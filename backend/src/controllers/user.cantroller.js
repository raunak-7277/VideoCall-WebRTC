import {User} from "../models/user.model.js"
import { Meeting } from "../models/meeting.model.js"
import httpStatus from "http-status"
import bcrypt,{hash} from "bcrypt"
import crypto from "crypto"

const login =async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password)
        return res.status(httpStatus.NO_CONTENT).json({message :"Username and Password required"})
    try {
        const user =await User.findOne({username})
        if(!user){
            return res.status(httpStatus.BAD_REQUEST).json({message: "User not found"})
        }
        if(await bcrypt.compare(password, user.password)){
            let token = crypto.randomBytes(20).toString("hex");

            user.token=token;
            await user.save();
            return res.status(httpStatus.OK).json({token :token})
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message :"Invalid userName or password"})
        }
    } catch (error) {
        return res.status(500).json({messgae: "somthing went Wrong"})
    }

}



const register= async (req,res) => {
    const {name,username,password}=req.body;


    try {
        const existingUser=await User.findOne({username})
        if(existingUser) {
            return res.status(httpStatus.FOUND).json({messgae :"User already exists"})
        }

        const hashedPassword =await bcrypt.hash(password,10)
        const newUser =new User({
            name :name,
            username :username,
            password: hashedPassword
        })
        await newUser.save();

        res.status(httpStatus.CREATED).json({messgae :"User Created"})
    } catch (error) {
        res.json({message: `Somthing went Wrong ${error}`})
    }
}


const getUserHistory=async(req,res)=>{
    const {token}=req.query;
    try {
        const user=await User.findOne({token:token})
        const meeting=await Meeting.find({user_id : user.username})
        res.json(meeting)
    } catch (error) {
        res.json({message : "Somthing went wrong"})
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

export {login,register,getUserHistory,addToHistory}