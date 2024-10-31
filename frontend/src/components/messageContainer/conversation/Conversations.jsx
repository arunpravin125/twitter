import React from 'react'
import Search from './Search'

import ConversationList from './ConversationList'

const Conversations = () => {
  return (
    <div className="h-screen w-48 p-1 mr-2  bg-gray-600">
      <Search/>
     <div className="divider bg-gray-500 h-1" ></div>
     <ConversationList/>
     <div className="divider bg-gray-500 h-1" ></div>
   <div className="" >
 
   </div>
    </div>
  )
}

export default Conversations
