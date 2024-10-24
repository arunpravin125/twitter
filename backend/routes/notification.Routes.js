import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import {  deleteNotification, getNotification, readNotification } from "../controllers/notification.controller.js"

export const notificationRoutes = express.Router()

notificationRoutes.get("/getNotification",protectRoute,getNotification)
notificationRoutes.post("/:id",protectRoute,deleteNotification)
notificationRoutes.post("/read/:id",protectRoute,readNotification)
