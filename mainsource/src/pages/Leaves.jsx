import React from 'react'
import Sidebar from '../components/Sidebar'
import Leaves_Mainbar from '../components/leave components/Leaves_Mainbar'

const Leaves = () => {
  return (
    <div className='flex'>

     <div>
          <Sidebar/>
     </div>

     <Leaves_Mainbar/>

    </div>
  )
}

export default Leaves