import React from 'react'
import Header from './Header'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { useMessageContext } from '../../../hooks/useMessage'

const MessageBox = () => {

     const {selectedConversation,setSelectedConversation,auth}  = useMessageContext()
  return (
    <>
    
    {selectedConversation?<div className="mr-2 h-screen w-full" >
     <Header/>
     <Messages/>
     <MessageInput/>
    </div>:<>
    <div  className="mr-1 p-1 flex items-center justify-center bg-red-200 text-black   h-screen w-full" >
        
        <div className=" flex flex-col items-center justify-center ">
            <h2>Hii {auth.username}</h2>
            <p>Select a person to message</p>
        </div>
        </div></>}
    </>
   
  )
}

export default MessageBox


