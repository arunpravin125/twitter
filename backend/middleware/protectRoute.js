import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(400).json({error:"Invalid token"})
        }
        const decoded = jwt.verify(token,process.env.jwt_secret)
        if(!decoded){
            return res.status(400).json({error:"UnAuthoried token or invalid token"})
        }
        
        const user = await User.findById(decoded.userId)
       
        req.user = user
        next()
    } catch (error) {
        console.log("error in proctect route",error)
        return res.status(400).json({error:error.message})
    }
}