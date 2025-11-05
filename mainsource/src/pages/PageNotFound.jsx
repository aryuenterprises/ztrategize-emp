import React from "react";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex gap-4 flex-col bg-gray-100 w-screen h-screen items-center justify-center">
     <p className="text-4xl">Page Not Found</p> 
     <NavLink to="/" className="bg-blue-500 hover:bg-blue-600 text-lg  font-medium text-white px-8 py-2  rounded-full">Go back to home</NavLink>
    </div>
  );
};

export default PageNotFound;
