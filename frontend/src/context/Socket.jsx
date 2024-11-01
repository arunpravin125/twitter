import { createContext,useContext,useState } from "react";
import io from "socket.io-client"
import { useMessageContext } from "../hooks/useMessage";
import { useEffect } from "react";

const SocketContext = createContext()

export const useSocketContext = ()=>{
    return useContext(SocketContext)
}


export const SocketContextProvider = ({children})=>{
    const [socket,setSocket] =useState()
    const {auth} = useMessageContext()
    const [onlineUser,setOnlineUser] = useState([])

    useEffect(()=>{
        if(auth){
        const socket = io("https://twitter-h517.onrender.com/",{
            query:{
                userId:auth?._id
            }
        })
        socket.on("getOnlineUser",(users)=>{
            setOnlineUser(users)
        })
        setSocket(socket)
        return ()=>socket.close()
    }else{
        if(socket){
            socket.close()
            setSocket(null)
        }
    }
    },[auth])
    
    return (<SocketContext.Provider value={{socket,setSocket,onlineUser,setOnlineUser,}}>
        {children}
    </SocketContext.Provider>)
}