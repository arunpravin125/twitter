import React, { useEffect, useRef, useState } from 'react'
import MessageL from './MessageL'
import { useMessageContext } from '../../../hooks/useMessage'
import toast from 'react-hot-toast'

const Messages = () => {
  const {conversations,setConversations,auth,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
 const [loading,setLoading] = useState(false)

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
 },[])
  return (
    <div className="bg-slate-400 p-1 h-96 mt-2 overflow-auto " >
    
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
