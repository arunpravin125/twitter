import { createContext, useContext, useState } from "react"
import {  useQuery } from "@tanstack/react-query";



const MessageContext = createContext()

export const useMessageContext = ()=>{
    return useContext(MessageContext)
}

export const MessageContextProvider = ({children})=>{
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [auth,setAuth] = useState(authUser)
    const [messages,setMessages] = useState([])
    const [conversations,setConversations] = useState()
    const [selectedConversation,setSelectedConversation] = useState()

    return (<MessageContext.Provider value={{messages,auth,setAuth,setMessages,conversations,setConversations,selectedConversation,setSelectedConversation}}>
        {children}
    </MessageContext.Provider>)

}