import { createContext, useContext, useState } from "react";



export const postContext = createContext()

export const usePostContext = ()=>{
    return useContext(postContext)
}


export const PostContextProvider = ({children})=>{

    const [allPost,setAllPost] = useState([])

    return(<postContext.Provider value={{allPost,setAllPost}}>
        {children}
    </postContext.Provider>)
}