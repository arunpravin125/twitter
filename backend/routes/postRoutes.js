import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { commentPost, createPost, deletePost, followingPost, getAllPosts, getLikePost, getUserPosts, likeUnlikePost } from "../controllers/post.controllers.js"

export const postRouter = express.Router()

postRouter.get("/getposts",protectRoute,getAllPosts)
postRouter.post("/create",protectRoute,createPost)
postRouter.delete("/:id",protectRoute,deletePost)
postRouter.post("/like/:id",protectRoute,likeUnlikePost)
postRouter.post("/comment/:id",protectRoute,commentPost)
postRouter.get("/getlike/:id",protectRoute,getLikePost)
postRouter.get("/following",protectRoute,followingPost)
postRouter.get("/user/:username",protectRoute,getUserPosts)
