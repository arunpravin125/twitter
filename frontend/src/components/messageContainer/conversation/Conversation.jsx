import React from 'react'
import { useMessageContext } from '../../../hooks/useMessage'
import { useSocketContext } from '../../../context/Socket'

const Conversation = ({conversation}) => {
  const {auth,selectedConversation,setSelectedConversation} = useMessageContext()
  const {onlineUser} = useSocketContext()

  return (
    <div onClick={()=>setSelectedConversation({conversationId:conversation?._id,
      userId:conversation?.participants[0]?._id,
      username:conversation?.participants[0]?.username,
      profileImg:conversation?.participants[0]?.profileImg,
      mock:conversation.mock
    })}  className={`h-14 gap-3 flex flex-nowrap rounded-md ${selectedConversation?.userId==conversation?.participants[0]._id?"bg-yellow-400":"bg-amber-100"} flex flex-row items-center justify-center  w-40 mb-3  hover:bg-amber-300 cursor-pointer `}>
     <div className={`avatar ${onlineUser.includes(conversation?.participants[0]?._id)?"online":""}`}>
  <div className=" w-10 h-10 rounded-full">
    <img src={conversation.participants[0].profileImg} />
  </div>
  
</div>
<div  >
<h2 className="text-black mt-0" >{conversation.participants[0].username}</h2>
<h2 className='text-xs text-black '>lastMsg:{conversation.lastMessage.text.length > 7 ? <>{conversation.lastMessage.text.slice(0,7)}...</>:conversation.lastMessage.text}</h2>
<h2 className='text-xs text-black'>{conversation.lastMessage.sender==auth._id?"You":"sender"}</h2>

</div>
    </div>
  )
}

export default Conversation
