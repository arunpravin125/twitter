import mongoose from "mongoose";

export const connection = async()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected",con.connection.host)
    } catch (error) {
        console.log("error in error",error)   
    }
}