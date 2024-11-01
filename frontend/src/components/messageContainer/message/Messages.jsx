import React, { useEffect, useRef, useState } from 'react'
import MessageL from './MessageL'
import { useMessageContext } from '../../../hooks/useMessage'
import toast from 'react-hot-toast'
import { useSocketContext } from '../../../context/Socket'

const Messages = () => {
  const {conversations,setConversations,auth,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
 const [loading,setLoading] = useState(false)
 const {socket,setSocket} =  useSocketContext()
 const messageRef = useRef()
 useEffect(()=>{
  const getMessages = async()=>{
    setLoading(true)
    try {
      const res = await fetch(`/api/message/getMessage/${selectedConversation?.userId}`)
      const data = await res.json()

      if(data.error){
        throw new Error(data.error)
      }
      console.log("getMessages",data)
      setMessages(data)
    } catch (error) {
      console.log("error in getMessages",error)
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }
  getMessages()

 },[selectedConversation?.userId,setMessages])
 
 useEffect(()=>{
  messageRef.current?.scrollIntoView({behavior:"smooth"})
 },[messages])

 useEffect(()=>{
  socket?.on("newMessage",(message)=>{

    if(selectedConversation.conversationId == message.conversationId){
      setMessages((prev)=>[...prev,message])
      setConversations((prev)=>{
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

 return ()=> socket.off("newMessage")

},[messages])



useEffect(()=>{
  const lastMessageFromOther = messages.length && messages[messages.length-1].sender !== auth._id
  if(lastMessageFromOther){
    socket.emit("markMessageAsSeen",{
      conversationId:selectedConversation.conversationId,
      userId:selectedConversation.userId
    })

  }
  socket.on("messagesSeen",({conversationId})=>{
    
     if(selectedConversation.conversationId==conversationId){
      setMessages(prev=>{
        const updateMessage = prev.map(message=>{
          if(!message.seen){
            return{
              ...message,seen:true
            }
          }
          return message
        })
        return updateMessage
      })
     }

  })




},[selectedConversation?.userId,messages,setMessages])




useEffect(()=>{
  socket?.on("messagesSeen",({conversationId})=>{
    if(conversationId=="undefined")return null
    if(selectedConversation.conversationId==conversationId){
      setConversations(prev=>{
        const updateConversation = prev.map(conversation=>{
          if(conversationId==conversation._id){
            return{
              ...conversation,lastMessage:{
                ...conversation.lastMessage,seen:true
              }
            }
          }
          return conversation
        })
        return updateConversation
      })
    }
  })
  
},[messages,setMessages])

  return (
    <div className="bg-purple-100 p-1 h-96 mt-2 overflow-auto " >
    
      {messages.length == 0?<>
      <div className="flex justify-center items-center" >
        <p>no conversations messages</p>
      </div>
      </>:<>
      {messages.map((message)=>{
        return(
          <div key={message._id} ref={messages.length-1 == messages.indexOf(message)?messageRef:null} > 
            <MessageL loading={loading}  ownMessage={message.sender==auth._id} messageText={message.text} message={message}  />
          </div>
        )
      })}
      </>}
   
    </div>
  )
}

export default Messages
