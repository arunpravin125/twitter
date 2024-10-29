import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connection } from "./DB/database.js"
import { authRoutes } from "./routes/authRoutes.js"
import { userRouter } from "./routes/user.routes.js"
import {v2 as cloudinary} from "cloudinary"
import { postRouter } from "./routes/postRoutes.js"
import { notificationRoutes } from "./routes/notification.Routes.js"
const app = express()
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true})) // to parse form data
app.use(cookieParser())
app.use(cors())
dotenv.config()

cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use("/api/auth",authRoutes)
app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)
app.use("/api/notification",notificationRoutes)

const usePort = process.env.PORT || 2001

app.listen(usePort,()=>{
    connection()
    console.log("Server started...",usePort)
})