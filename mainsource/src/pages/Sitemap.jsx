import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sitemap = () => {
     let navigate=useNavigate()
  return (
    <div className='bg-gray-100 w-screen gap-5 flex items-center justify-center h-screen'>

     <button onClick={()=>navigate('/')} className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl text-white'>Login</button>
     <button onClick={()=>navigate('/dashboard')} className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl text-white'>Dashboard</button>
     <button onClick={()=>navigate('/leaves')} className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl text-white'>Leave</button>
     <button onClick={()=>navigate('/attendance')} className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl text-white'>Attendance</button>
     <button onClick={()=>navigate('/message')} className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl text-white'>Message</button>

    </div>
  )
}

export default Sitemap