import React from 'react'
import aryu_logo from "../assets/aryu_logo.svg";


const Footer = () => {
  return (
     <div>
        <div className="flex gap-2 flex-wrap items-center text-xs md:text-sm text-gray-500 mt-10 mb-2 justify-center">
        <p>Copyrights &copy; {new Date().getFullYear()}</p>
        <div className="flex items-center gap-2">
          <a target="_blank" href="https://aryutechnologies.com/">
            <p>Aryu enterprises PVT. LTD. All rights reserved.</p>
          </a>
          <img src={aryu_logo} alt="" />
        </div>
      </div> 
     </div>
      
  )
}

export default Footer