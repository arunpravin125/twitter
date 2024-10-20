import express from "express"
import { login, logout, signup } from "../controllers/auth.controllers.js"

export const authRoutes = express.Router()

authRoutes.post("/signup",signup)
authRoutes.post("/login",login)
authRoutes.post("/logout",logout)
