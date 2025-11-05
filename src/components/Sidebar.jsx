import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCalendar2Check } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import medics_logo from "/Aryu.svg";
import { API_URL } from "./config";
import { useEffect, useState } from "react";
import ButtonLoader from "./ButtonLoader";
import { RiTeamLine } from "react-icons/ri";
import { GrTask } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdOutlineHomeWork } from "react-icons/md";
import { MdOutlinePolicy } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { TbPhotoBitcoin } from "react-icons/tb";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname; 
  const [userDetails, setUserDetails] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const bidding = JSON.parse(localStorage.getItem("hrms_employee"));
  const role = bidding?.role?.name;

  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setUserDetails(user);
  }, []);

  const [arrowClicked, setArrowClicked] = useState(() => {
    // Get the persisted state from localStorage
    const savedState = localStorage.getItem("sidebarState");
    return savedState === "true";
  });

  let navigate = useNavigate();

  const onClickArrow = () => {
    const newState = !arrowClicked;
    setArrowClicked(newState);
    localStorage.setItem("sidebarState", newState); // Persist the new state
  };

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      setButtonLoading(true);
      setTimeout(() => {
        localStorage.removeItem("hrms_employee");
        localStorage.removeItem("hrms_employee_token");
        window.location.reload();

        // token remove

        localStorage.removeItem("hrms_employee_token");
        localStorage.removeItem("hrms_employee");
        localStorage.removeItem("token_expiry");

        window.scrollTo({ top: 0, behavior: "instant" });
        setButtonLoading(false);
      }, 800);
    } else if (label === "Teamwork") {
      window.open("https://pmtool.medicsresearch.com/");
    } else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  function onClickCard(employeeId) {
    navigate("/employeedetails", {
      state: { employeeId },
    });

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  return (
    <div>
      <section
        className={`bg-white max-md:hidden transition-all duration-500 flex flex-col  ${
          arrowClicked ? "w-[60px]" : "w-52"
        }`}
      >
        <div className="fixed flex flex-col   h-full">
          {/* Toggle Button */}
          <div
            className="flex justify-end  mt-5 items-center"
            onClick={onClickArrow}
            title="Toggle Sidebar"
          >
            <div
              className={`${
                arrowClicked ? "-me-3" : "-me-8"
              } w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer `}
            >
              {arrowClicked ? (
                <IoIosArrowForward className="w-3 h-3" />
              ) : (
                <IoIosArrowBack className="w-3 h-3" />
              )}
            </div>
          </div>

          {arrowClicked ? (
            <div className="h-12 mt-6 ms-2 text-xl font-semibold">
              <p className="text-[#1F98B5]">
                <img
                  src={medics_logo}
                  alt=""
                  className=" h-14 w-10 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </p>
            </div>
          ) : (
            // <img src={medicsresearch_logo} alt="" className="h-12 w-24 ms-8" />
            <img
              src={medics_logo}
              alt=""
              className="h-20 w-24 ms-8 p-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          {/* Sidebar Menu */}
          <div className="flex-grow w-full flex flex-col  justify-start">
            <div
              className={`flex  flex-col ${
                arrowClicked ? "items-center" : "items-start"
              } gap-1 mt-5`}
            >
              {[
                { icon: <CiBoxList />, label: "Dashboard", path: "dashboard" },
                {
                  icon: <BsCalendar2Check />,
                  label: "Attendance",
                  path: "attendance",
                },
                { icon: <HiOutlineHome />, label: "Leaves", path: "leaves" },
                { icon: <MdOutlineHomeWork />, label: "WFH", path: "wfh" },
                { icon: <GrTask />, label: "TaskList", path: "tasklist" },
                { icon: <TbReportSearch />, label: "Reports", path: "reports" },
                { icon: <CiMail />, label: "Request", path: "request" },
                { icon: <MdOutlinePolicy />, label: "Policy", path: "policy" },
                ...(role === "Online Bidder"
                  ? [
                      {
                        icon: <TbPhotoBitcoin />,
                        label: "Bidding Assets",
                        path: "bidding-assets",
                      },
                    ]
                  : []),
                   ...(role === "Online Bidder"
                  ? [
                      {
                        icon: <TbPhotoBitcoin />,
                        label: "Bidding Details",
                        path: "bidding",
                      },
                    ]
                  : []),  

                // { icon: <RiTeamLine/>, label: "Teamwork" },
              ].map((item, idx) => (
                <div
                  onClick={() => onClickSidebarMenu(item.path)}
                  key={idx}
                  className={`flex w-full flex-grow ${
                    arrowClicked
                      ? "justify-center items-center "
                      : "justify-normal"
                  } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer 
                    ${
                      currentPath.replace(/^\//, "") === item.path
                        ? "bg-blue-100 text-[#4F46E5]"
                        : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                    }`}
                >
                  <div className="flex items-center justify-center h-5 w-5">
                    {item.icon}
                  </div>
                  {!arrowClicked && <p className="text-sm">{item.label}</p>}
                </div>
              ))}
            </div>

            <hr className="my-3 mx-4 border-gray-300" />
          </div>

          {/* logout */}
          <div
            onClick={() => onClickSidebarMenu("/")}
            className={`flex items-center ${
              arrowClicked ? "justify-center" : "justify-normal"
            } ${
              buttonLoading ? "justify-center" : "justify-normal"
            } px-3 py-3 gap-3 items-center h-10 bg-blue-500 hover:bg-blue-600 duration-300 rounded-full cursor-pointer`}
          >
            {buttonLoading ? (
              <ButtonLoader />
            ) : (
              <>
                <div className="text-white flex items-center justify-center">
                  <MdLogout />
                </div>
                {!arrowClicked && (
                  <p className="text-sm font-medium text-white">Logout</p>
                )}
              </>
            )}
          </div>

          {/* User Section */}
          <div
            // onClick={() => onClickSidebarMenu("myprofile")}
            className=" w-max"
          >
            <hr className="border-gray-300 mt-2 " />
            <div
              className="flex items-center justify-between gap-3 px-2 py-4 w-full cursor-pointer hover:bg-blue-100/50  duration-300"
              onClick={() => onClickCard(userDetails._id)}
            >
              <img
                src={`${API_URL}api/uploads/${userDetails.photo}`}
                alt=""
                className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover hover:scale-105 duration-300"
              />
              {!arrowClicked && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-500">
                      Welcome back
                    </p>
                  </div>
                  <p className="font-medium text-sm w-32 ">
                    {userDetails.employeeName}
                    {/* venu */}
                  </p>
                </div>
              )}
              {/* {!arrowClicked && (
                <IoIosArrowForward className="ml-auto  text-gray-600 cursor-pointer" />
              )} */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
