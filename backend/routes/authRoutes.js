import express from "express"
import { getMe, login, logout, signup } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js"

export const authRoutes = express.Router()

authRoutes.post("/signup",signup)
authRoutes.post("/login",login)
authRoutes.post("/logout",logout)
authRoutes.get("/me",protectRoute,getMe)
