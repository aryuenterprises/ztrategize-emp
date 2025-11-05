import React from 'react'
import Sidebar from '../components/Sidebar'
import Message_Mainbar from '../components/message components/Message_Mainbar'

const Message = () => {
  return (
    <div className='flex'>
     <div>
          <Sidebar/>
     </div>

          <Message_Mainbar/>
    </div>
  )
}

export default Message