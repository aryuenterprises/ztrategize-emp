import React from 'react'
import Sidebar from '../Sidebar'
import MonthlyAttendanceDetails_Mainbar from './MonthlyAttendanceDetails_Mainbar'

const MonthlyAttendanceDetails = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
          <Sidebar/>
     </div>

     <MonthlyAttendanceDetails_Mainbar/>

    </div>
  )
}

export default MonthlyAttendanceDetails