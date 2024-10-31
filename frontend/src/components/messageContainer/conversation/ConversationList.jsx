import React, { useEffect } from 'react'
import Conversation from './Conversation'
import { useMessageContext } from '../../../hooks/useMessage'
import {toast} from "react-hot-toast"
import { useSocketContext } from '../../../context/Socket'
const ConversationList = () => {

  const {conversations,setConversations,messages,selectedConversation,setSelectedConversation} = useMessageContext()
  const {socket} = useSocketContext()
  useEffect(()=>{
 
    const getConversation =async()=>{
      try {
        const res = await fetch("/api/message/getConversation")
        const data = await res.json()

        console.log("getConversation",data)

        if(data.error){
          throw new Error(data.error)
        }
        setConversations(data)
        console.log("conversation",data)
      } catch (error) {
        console.log("error in getConversation",error)
        toast.error(error.message)
      }
    }
getConversation()
  },[])

  useEffect(()=>{
    socket?.on("newMessage",(message)=>{
    console.log("message",message)
      if(selectedConversation.conversationId == message.conversationId){
        
        setConversations(prev=>{
          const updateConversation = prev.map(conversation=>{
            if(selectedConversation.conversationId==conversation._id){
              return{
                ...conversation,lastMessage:{
                  ...conversation.lastMessage,text:message.text,sender:message.sender
                }
              }
            }
            return conversation
          })
          return updateConversation
        })
  
      }
      
    })
  
   return ()=> socket?.off("newMessage")
  
  },[messages])



  return (
    <div className="h-96 w-44 ml-2  overflow-auto  " >
      
     
      {conversations && conversations.map((conversation)=>{
        return <Conversation key={conversation._id} conversation={conversation}/>
      })}
     
     
    </div>
  )
}

export default ConversationList


// lastMessage
// : 
// sender
// : 
// "6720d784d8da494d917aa9c4"
// text
// : 
// "i am ben10"
// [[Prototype]]
// : 
// Object
// participants
// : 
// Array(1)
// 0
// : 
// {_id: '6720d784d8da494d917aa9c4', username: 'ben10', profileImg: 'https://res.cloudinary.com/dt8le3vdq/image/upload/v1730206021/rywc1hnrywjimzzueqmh.jpg'}
// length
// : 
// 1
// [[Prototype]]
// : 
// Array(0)
// __v
// : 
// 0
// _id
// : 
// "6721de3bfe98afa


// const alreadyConversation = conversations.map((conversation)=>conversation.participants[0]._id ==data._id)

// // const alreadyConversation = conversations.map((conversation)=>conversation.participants[0]._id ==data._id)
// // console.log("alreadyConversation",alreadyConversation)
//       // setSelectedConversation({conversationId:conversation._id,
//       //   userId:conversation.participants[0]._id,
//       //   username:conversation.participants[0].username,
//       //   profileImg:conversation.participants[0].profileImg,
//       //   mock:conversation.mock
//       // })
//      const getConversation = conversations.filter((conversation)=>conversation.participants[0]._id == data._id)
//    console.log("getConversation",getConversation)
// console.log("alreadyConversation",alreadyConversation)
// if(alreadyConversation){
//    setSelectedConversation({conversationId:getConversation._id,
//         userId:getConversation.participants[0]._id,
//         username:getConversation.participants[0].username,
//         profileImg:getConversation.participants[0].profileImg,
//         mock:getConversation.mock
//       })