import React, { useState } from 'react'
import { useMessageContext } from '../../../hooks/useMessage'
import toast from 'react-hot-toast'
import { IoSendSharp } from "react-icons/io5";

const MessageInput = ({}) => {
  const {conversations,setConversations,auth,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
  const [loading,setLoading] = useState(false)
  const [text,setText] = useState("")

  
  const messageSend = async()=>{
    setLoading(true)
    try {
      const res = await fetch(`/api/message/sendMessage/${selectedConversation.userId}`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({text:text})
      })
      const data = await res.json()
      console.log("messageInput",data)
      if(data.error){
        throw new Error(data.error)
      }
     
      setMessages((prevMessage)=>[...prevMessage,data])
      setText("")
    } catch (error) {
      console.log("error in messageSend",error)
      toast.error(error.message)
    }finally{
    setLoading(false)
    }
  }
 
 
  return (
    <div className="mt-2  w-full flex gap-3" >
      <input value={text} placeholder='Send a message.....' onChange={(e)=>setText(e.target.value)} className="w-3/4 h-9 rounded-sm bg-green-200 text-black p-1" ></input>
      <button onClick={messageSend} className="flex items-center justify-center" >
        
        {loading?<span className="loading loading-spinner loading-sm"></span>:<IoSendSharp className="h-6 w-6"/>}
      </button>
    </div>
  )
}

export default MessageInput
