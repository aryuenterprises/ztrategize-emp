import React from 'react'
import Sidebar from '../components/Sidebar'
import Policy_details from './policy_details'
import Bidding_details from './Bidding_details'

const Bidding_main = () => {
  return (
    <div className='flex'>

     <div>
          <Sidebar/>
     </div>

     <Bidding_details/>

    </div>
  )
}

export default Bidding_main