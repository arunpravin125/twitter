import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { IoSearchCircleOutline } from "react-icons/io5";
import { useMessageContext } from '../../../hooks/useMessage';
const Search = () => {

  const [username,setUsername] = useState()
  const [loading,setLoading]= useState(false)
  const {auth,conversations,setConversations,selectedConversation,setSelectedConversation,messages,setMessages} = useMessageContext()
  const handleSearch = ()=>{
    if(!username){
      toast.error("Enter username")
     
    }
    handleUser(username)
  }

  const handleUser = async(user)=>{
    
    setLoading(true)
    try {
      const res = await fetch(`/api/users/profile/${user}`)
      const data = await res.json()

      if(data.error){
       throw new Error(data.error)
      }
   
      if(data._id == auth._id){
     toast.error("You cannot search yourself")
     return;
      }
      console.log("searchuser",data)

     const alreadyConversation = conversations.some((conversation)=>conversation.participants[0]._id==data._id)
      const getConversation = conversations.filter((conversation)=>conversation.participants[0]._id == data._id)
      console.log("getConversation",getConversation)
      console.log("already",alreadyConversation)

      if(alreadyConversation){
        setSelectedConversation(
          {conversationId:getConversation[0]._id,
            userId:getConversation[0].participants[0]._id,
            username:getConversation[0].participants[0].username,
            profileImg:getConversation[0].participants[0].profileImg,
            mock:getConversation[0].mock
          
        })
      }else{
        const mockConversation = {
          _id:232134235346,
          lastMessage:{
            sender:"",
            text:""
          },
          participants:[{
            _id:data._id,
            username:data.username,
            profileImg:data.profileImg
          }],
        
        }
        console.log("mockConversion",mockConversation)
        setConversations(prevCon=>[...prevCon,mockConversation])
        console.log("conversation",conversations)
      }


    } catch (error) {
      console.log("error in searchUser",error)
      toast.error(error.message)
    }finally{
        setLoading(false)
    }
  }


  return (
    <div className="flex">
    <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-36 p-1 rounded-md  bg-lime-300 text-black" placeholder='Search....'></input>
  
  <button>
  {loading?<span className="loading loading-spinner ml-2 h-10 loading-md"></span>:<IoSearchCircleOutline onClick={handleSearch} className="h-10 w-10 ml-1 hover:text-gray-500 cursor-pointer" />}
  </button>
 
  
    </div>
  )
}

export default Search
