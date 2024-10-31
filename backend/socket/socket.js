import {Server} from "socket.io"
import http  from "http"
import express from "express"
import Message from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js"


const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        method:["POST GET"]
    }
})

var socketMap = {}

export const getReceiverScoket = (receiverId)=>{
    return socketMap[receiverId]
}

io.on("connection",(socket)=>{
    console.log("user connected..",socket.id)

    const userId = socket.handshake.query.userId

    if(userId !== "undefined"){
        socketMap[userId]=socket.id
    }

    io.emit("getOnlineUser",Object.keys(socketMap))

    socket.on("markMessageAsSeen",async({conversationId,userId})=>{
   
        try {
            await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}})
            await Conversation.updateMany({_id:conversationId},{$set:{"lastMessage.seen":true}})
    
            io.to(socketMap[userId]).emit("messagesSeen",{conversationId})
        } catch (error) {
            console.log("error in markMessagesAsSeen",error)
        }
    })

   console.log("userId",userId)
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
        delete socketMap[userId]
    })
})


export {io,server,app}