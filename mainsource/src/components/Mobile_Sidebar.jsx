import React from "react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import medics_logo from "/Aryu.svg";
import { BsCalendar2Check } from "react-icons/bs";
import { MdLogout, MdOutlineHomeWork, MdOutlinePolicy } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { CiDeliveryTruck, CiBoxList, CiMail } from "react-icons/ci";
import { API_URL } from "./config";
import { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { GrTasks } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb";

const Mobile_Sidebar = () => {
  let navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([]);

  const [hamburgerIconClicked, setHamburgerIconClicked] = useState(false);

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      localStorage.removeItem("hrms_employee");
      localStorage.removeItem("hrms_employee_token");
      window.location.reload()
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    else if(label==="Teamwork"){
      window.open("https://pmtool.medicsresearch.com/")
    }
    else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const onClickHamburgerIcon = () => {
    setHamburgerIconClicked(!hamburgerIconClicked);
  };

  useEffect(() => {
    if (hamburgerIconClicked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerIconClicked]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setUserDetails(user);
  }, []);

  return (
    <div>
      <div className="flex my-3 justify-start items-center w-full md:hidden">
        <GiHamburgerMenu className="text-xl" onClick={onClickHamburgerIcon} />
      </div>

      {hamburgerIconClicked && (
        <div className="fixed block md:hidden h-screen  inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-25"
            onClick={() => setHamburgerIconClicked(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[70vw] sm:w-[50vw] bg-white shadow-lg transform transition-transform duration-1000 ease-in-out${
              hamburgerIconClicked ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex mt-4 ps-5">
                <IoClose
                  className="text-2xl"
                  onClick={() => setHamburgerIconClicked(false)}
                />
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center">
                <img src={medics_logo} alt="" className="w-20 h-10" />
              </div>

              {/* Sidebar Menu */}
              <div className="flex-grow overflow-y-auto w-full flex flex-col justify-start">
                <div className="flex flex-col gap-1 mt-3 px-4">
                  <div
                    onClick={() => onClickSidebarMenu("Dashboard")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiBoxList />
                    </div>
                    <p>Dashboard</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("Attendance")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <BsCalendar2Check />
                    </div>
                    <p>Attendance</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Leaves")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <HiOutlineHome />
                    </div>
                    <p>Leaves</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("wfh")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdOutlineHomeWork />
                    </div>
                    <p>WFH</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("tasklist")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <GrTasks />
                    </div>
                    <p>TaskList</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("reports")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <TbReportSearch />
                    </div>
                    <p>Reports</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("request")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiMail />
                    </div>
                    <p>Request</p>
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("policy")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdOutlinePolicy />
                    </div>
                    <p>Policy</p>
                  </div>
                  {/* <div
                    onClick={() => onClickSidebarMenu("Teamwork")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <RiTeamLine />
                    </div>
                    <p>Teamwork</p>
                  </div> */}

                  {/* <div
                    onClick={() => onClickSidebarMenu("Message")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <FaRegMessage />
                    </div>
                    <p>Message</p>
                  </div> */}
                </div>

                <hr className="my-3 mx-4 border-gray-300" />

                {/* Settings */}
                {/* <div className="mt-3 px-4">
                  <div className="flex items-center hover:bg-blue-100 px-3 py-2 hover:text-[#4F46E5] rounded-lg gap-3 text-gray-500 text-sm font-medium cursor-pointer">
                    <IoSettingsOutline />
                    <p className="text-sm">Settings</p>
                  </div>
                </div> */}

                {/* Logout */}
                <div onClick={()=>onClickSidebarMenu("/")} className="bg-blue-500 rounded-full mb-3 text-white w-fit mx-7">
                  <div className="flex gap-3 items-center px-3 py-2">
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdLogout />
                    </div>
                    <p className="text-sm">Logout</p>
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div>
                <hr className="border-gray-300" />
                <div className="flex items-center gap-3 px-4 py-4">
                  <img
                    src={`${API_URL}/${userDetails.profile_image}`}
                    alt=""
                    className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-gray-500">
                      Welcome back
                    </p>
                    <p className="font-medium text-sm">{userDetails.employee_name}</p>
                  </div>
                  <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mobile_Sidebar;
