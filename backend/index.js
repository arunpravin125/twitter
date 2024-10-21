import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connection } from "./DB/database.js"
import { authRoutes } from "./routes/authRoutes.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true})) // to parse form data
app.use(cookieParser())
app.use(cors())
dotenv.config()

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

const usePort = process.env.PORT || 2001

app.listen(usePort,()=>{
    connection()
    console.log("Server started...",usePort)
})