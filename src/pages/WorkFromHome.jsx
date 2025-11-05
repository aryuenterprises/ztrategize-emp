import React from 'react'
import Sidebar from '../components/Sidebar'
import Leaves_Mainbar from '../components/leave components/Leaves_Mainbar'
import WorkFromHome_Mainbar from '../components/leave components/WorkFromHome_Mainbar'

const WorkFromHome = () => {
  return (
    <div className='flex'>

     <div>
          <Sidebar/>
     </div>

     <WorkFromHome_Mainbar/>

    </div>
  )
}

export default WorkFromHome