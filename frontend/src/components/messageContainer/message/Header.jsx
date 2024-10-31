import React from 'react'
import { useMessageContext } from '../../../hooks/useMessage'

const Header = () => {
  const {conversations,setConversations,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()

  


  return (
    <div className="h-9 w-full p-1 mt-1 bg-yellow-600" >
      <p>To:{selectedConversation.username}</p>
    </div>
  )
}

export default Header
