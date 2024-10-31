import React, { useEffect } from 'react'
import Conversations from './conversation/Conversations'
import MessageBox from './message/MessageBox'
import { useMessageContext } from '../../hooks/useMessage'


const ChatUi = () => {

  const {auth,conversations,setConversations,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
    

  useEffect(()=>{
    
    return ()=> setSelectedConversation("")
  },[])

  return (
    <div className="w-2/3 flex rounded-sm flex-nowrap  bg-gray-600 h-screen ">
      <Conversations/>
      <MessageBox/>
    </div>
  )
}

export default ChatUi
