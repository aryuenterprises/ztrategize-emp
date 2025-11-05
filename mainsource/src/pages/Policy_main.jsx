import React from 'react'
import Sidebar from '../components/Sidebar'
import Policy_details from './policy_details'

const Policy_main = () => {
  return (
    <div className='flex'>

     <div>
          <Sidebar/>
     </div>

     <Policy_details/>

    </div>
  )
}

export default Policy_main