import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { getMessage, getUser, sendMessage } from "../controllers/message.controllers.js"

export const messageRoutes = express.Router()

messageRoutes.post("/sendMessage/:id",protectRoute,sendMessage)
messageRoutes.get("/getMessage/:id",protectRoute,getMessage)
messageRoutes.get("/getConversation",protectRoute,getUser)