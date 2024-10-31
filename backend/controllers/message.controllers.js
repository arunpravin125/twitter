import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import User from "../models/user.model.js"
import { getReceiverScoket, io } from "../socket/socket.js"

export const sendMessage = async(req,res)=>{
    try {
        const currentuser = req.user._id
        const {id:recpient} = req.params
        const {text} = req.body
        const user = await User.findById(recpient)
        
        if(!text){
            return res.status(400).json({error:"write a text"})
        }
        if(!user){
            return res.status(400).json({error:"User not found"})
        }

        let conversation;
         conversation =await Conversation.findOne({
            participants:{$all:[currentuser,user._id]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[currentuser,recpient],
                lastMessage:{
                    sender:currentuser,
                    text:text

                }
            })
            await conversation.save()
        }

        const newMessages = await Message({
            conversationId:conversation._id,
            text:text,
            sender:currentuser

        })
       await Promise.all([ newMessages.save(),conversation.updateOne({
            lastMessage:{
                sender:currentuser,
                text:text
            }
        })])

        
        const receiverSocketId = getReceiverScoket(recpient)
   console.log("receiverSocketId",receiverSocketId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessages)
    }

        res.status(200).json(newMessages)
        
    } catch (error) {
        console.log("error in sendMessage",error)
        res.status(400).json({error:error.message})
    }
}

export const getMessage = async(req,res)=>{
    try {
        const {id:recpient} = req.params
        const currentuser = req.user._id

        const conversation = await Conversation.findOne({
            participants:{$all:[currentuser,recpient]}
        })

        if(!conversation){
            return res.status(400).json([])
        }

        const messages = await Message.find({
            conversationId:conversation._id
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log("error in getMessage",error)
        res.status(400).json({error:error.message})
    }
}

export const getUser = async(req,res)=>{
    try {
        const currentUser = req.user._id

        let conversation = await Conversation.find({
            participants:currentUser
        }).populate({path:"participants", select:"username profileImg"})
 
        conversation.forEach((con)=>{
             con.participants = con.participants.filter(participant=>{
                return currentUser.toString() !== participant._id.toString()
             })
          
        })
   
        res.status(200).json(conversation)

    } catch (error) {
        console.log("error in getUser",error)
        res.status(400).json({error:error.message})
    }
}