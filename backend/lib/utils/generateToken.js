import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({userId},process.env.jwt_secret,{
        expiresIn:"15d"
    })

    res.cookie("jwt",token,{
        maxAge:15*24*60*60*100, // 15days
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    })
}