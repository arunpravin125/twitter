import React from 'react'
import { useMessageContext } from '../../../hooks/useMessage'
import { extractTime } from '../../../utils/extractTime'

const MessageL = ({ownMessage,message,messageText,loading}) => {
  const {conversations,setConversations,auth,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
  return (
    <>
    {loading?<>
      <div className={"chat chat-start"}>
      <div className="flex w-52 flex-col gap-4">

  <div className="skeleton h-4 w-28 rounded-md"></div>
  <div className="skeleton h-4 w-ful rounded-lg "></div>
  
</div>
</div>
<div className={"chat chat-end"}>
      <div className="flex w-48 flex-col gap-4">

  <div className="skeleton h-4 w-28 rounded-md"></div>
  <div className="skeleton h-4 w--full rounded-lg "></div>
  
</div>
</div>
    </>:<>
    <div>
      <div className={`chat ${ownMessage?"chat-end":"chat-start"}`}>
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img
        alt="Tailwind CSS chat bubble component"
        src={!ownMessage?selectedConversation.profileImg:auth.profileImg} />
    </div>
  </div>
  <div className="chat-header">
   
    <time className="text-md text-black opacity-50">{extractTime(message.createdAt)}</time>
  </div>
  <div className="chat-bubble flex flex-wrap w-auto">{message.text}</div>
  {ownMessage?<div className="chat-footer opacity-50 text-black  text-md ">{message.seen?"seen":"delivered"}</div>:""}
</div>

    </div>
    </>}
    </>
  
  )
}

export default MessageL
