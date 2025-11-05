import React from "react";
import sample from "../../assets/sample.jpg";
import time_tracker from "../../assets/time_tracker.svg";
import { IoMdPlayCircle } from "react-icons/io";
import { MdPauseCircle } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { API_URL } from "../config";
import axios from "axios";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import party from "party-js";

import Swal from "sweetalert2";

const Dashboard_Mainbar = () => {
  let navigate = useNavigate();
  const bidding = JSON.parse(localStorage.getItem("hrms_employee"));
  const role = bidding?.role?.name;
  // console.log("role",role);

  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [leavedetails, Setleavedetails] = useState([]);
  // console.log("leavedetails", leavedetails);

  const [relivestatus, setRelivestatus] = useState([]);
  // console.log("relivestatus",relivestatus)
  const [upcomingHolidays, setUpcomingHolidays] = useState("");
  console.log("upcomingHolidays", upcomingHolidays);

  const [timeTracker, setTimeTracker] = useState("");
  const [attendanceReason, setAttendanceReason] = useState();
  const [empid, setEmpid] = useState([]);
  // console.log("empid",empid)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    const id = user._id;

    const getAttendanceReason = localStorage.getItem("attendanceReason");
    setAttendanceReason(getAttendanceReason);
    setUserDetails(user);
    setEmpid(id);
    setLoading(false);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    // setEmployeeId(user.id);
    const token = localStorage.getItem("hrms_employee_token");
    // setToken(token);
    // console.log("id ", user.id);

    getApiData(user, token);
  }, []);

  const getApiData = async (empid) => {
    // console.log("idsa",empid._id)

    try {
      let response = await axios.get(
        `${API_URL}api/attendance/dashboard-attendance-birthday`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          params: {
            // emp_id: id/,
            employeeId: empid._id,
          },
        }
      );

      console.log("response", response);
      setUpcomingHolidays(response.data);
      const upcoming_birthdays = response.data.emplooyeBirthday;
      // const { time_tracker, upcoming_holiday, upcoming_birthdays } =
      //   response.data;
      setUpcomingBirthdays(upcoming_birthdays);
      setRelivestatus(response.data.checkEmployeeEmpty);
      Setleavedetails(response.data);

      // setTimeTracker(time_tracker);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // const [time, setTime] = useState(0);
  // const intervalRef = useRef(null);

  // const startStopwatch = () => {
  //   const startTime = localStorage.getItem('stopwatchStart');
  //   if (!startTime) {
  //     localStorage.setItem('stopwatchStart', Date.now());
  //   }
  //   intervalRef.current = setInterval(() => {
  //     const start = parseInt(localStorage.getItem('stopwatchStart'), 10);
  //     setTime(Date.now() - start);
  //   }, 1000);
  // };

  // const stopStopwatch = () => {
  //   clearInterval(intervalRef.current);
  //   localStorage.removeItem('stopwatchStart');
  //   setTime(0);
  // };

  // useEffect(() => {
  //   // if (localStorage.getItem('stopwatchStart')) {
  //     startStopwatch();
  //   // }
  //   return () => clearInterval(intervalRef.current);
  // }, []);

  // const formatTime = (milliseconds) => {
  //   const totalSeconds = Math.floor(milliseconds / 1000);
  //   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  //   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  //   const seconds = String(totalSeconds % 60).padStart(2, '0');
  //   return `${hours}:${minutes}:${seconds}`;
  // };

  // const [time, setTime] = useState(0);

  // useEffect(() => {
  //   const updateTime = () => {
  //     const savedValue = localStorage.getItem("stopwatchValue");
  //     if (savedValue) setTime(parseInt(savedValue, 10));
  //   };

  //   // Initial load
  //   updateTime();

  //   // Listen for updates from the main stopwatch component
  //   window.addEventListener("stopwatchUpdate", updateTime);

  //   return () => {
  //     window.removeEventListener("stopwatchUpdate", updateTime);
  //   };
  // }, []);

  // const formatTime = (milliseconds) => {
  //   const totalSeconds = Math.floor(milliseconds / 1000);
  //   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  //   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
  //     2,
  //     "0"
  //   );
  //   const seconds = String(totalSeconds % 60).padStart(2, "0");
  //   return `${hours}:${minutes}:${seconds}`;
  // };

  const [time, setTime] = useState(0);

  const startInterval = () => {
    if (!window.stopwatchInterval) {
      window.stopwatchInterval = setInterval(() => {
        const start = parseInt(localStorage.getItem("stopwatchStart"), 10);
        if (start) {
          const currentTime = Date.now() - start;
          localStorage.setItem("stopwatchValue", currentTime);
          window.dispatchEvent(new Event("stopwatchUpdate"));
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const savedValue = localStorage.getItem("stopwatchValue");
      if (savedValue) setTime(parseInt(savedValue, 10));
    };

    updateTime();

    const startTime = localStorage.getItem("stopwatchStart");
    const pausedTime = localStorage.getItem("pausedTime");
    if (startTime && !pausedTime) {
      startInterval();
    }

    window.addEventListener("stopwatchUpdate", updateTime);

    return () => {
      window.removeEventListener("stopwatchUpdate", updateTime);
    };
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // console.log(upcomingHolidays);

  function onClickCard(employeeId) {
    navigate("/employeedetails", {
      state: { employeeId },
    });
    // console.log(employeeId);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  const buttonRef = useRef(null);

  const handleConfetti = () => {
    party.confetti(buttonRef.current, {
      count: party.variation.range(20, 100),
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const [relievingDate, setRelievingDate] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  // Auto trigger popup if condition is false
  useEffect(() => {
    if (relivestatus === false) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [relivestatus]);

  // useEffect(() => {
  //   setShowPopup(true);
  // }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Relieving Date:", relievingDate);
  //   console.log("Reason:", reason);

  //   // Call API here if needed
  //   setShowPopup(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        expectedRelivingDate: relievingDate,
        relivingReason: reason,
      };

      const response = await axios.put(
        `${API_URL}api/employees/update-employee/${empid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });
      setShowPopup(false);
      fetchProject();
      setRelievingDate("");
      setReason("");

      //   fetchProject();
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
      // if (err.response?.data?.errors) {
      //   setErrors(err.response.data.errors);
      // } else {
      //   console.error("Error submitting form:", err);
      // }
    }
  };

  return (
    <div className="h-full w-screen flex flex-col justify-between min-h-screen bg-gray-100 ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
            <Mobile_Sidebar />

            <div className="flex gap-2 items-center">
              <p className="text-sm text-blue-500">Dashboard</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 mt-8">
              {/* leftside bar */}
              <section className="w-full flex flex-wrap md:flex-nowrap items-center gap-10">
                <div className="flex flex-wrap gap-5">
                  <div
                    className="flex md:basis-full w-[300px] rounded-2xl bg-white shadow-sm cursor-pointer bg-cover  flex-col  top-8  items-center px-3 py-3 md:px-5 md:py-5"
                    title="Click here to view full details"
                    onClick={() => onClickCard(userDetails._id)}
                  >
                    <img
                      // src={sample}
                      src={`${API_URL}api/uploads/${userDetails.photo}`}
                      alt=""
                      className="h-[220px] w-full object-cover rounded-sm"
                    />
                    <div className="flex flex-col  items-center mt-2">
                      <p className="text-[18px] md:text-[24px] font-medium text-center capitalize">
                        {userDetails.employeeName}
                      </p>
                      <p className="text-gray-500 text-sm md:text-md mt-2">
                        {userDetails.employeeId}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500  font-medium bg-blue-100/50 px-[8px] py-[2px] rounded-full text-center mt-1">
                        {userDetails?.role?.name}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        {userDetails.email}
                      </p>
                    </div>
                  </div>

                  {/* <div className="bg-white  basis-[45%] flex-grow flex flex-col items-center justify-center rounded-2xl gap-3 px-3 py-3 md:px-5 md:py-5">
                    <p className="font-medium">Time tracker</p>

                    <div className="flex flex-col items-center justify-center rounded-full h-36 w-36 bg-gray-900 text-white">
                      <p className="text-2xl font-semibold ">
                        {formatTime(time)}
                      </p>
                      <p className="text-sm font-medium">Work Time</p>
                    </div>
                  </div> */}
                </div>

             {upcomingHolidays?.employeeType === "Full Time" && role !== "Online Bidder" && (

                  <section className="w-[35%] ">
                    <section>
                      {" "}
                      <div className="bg-[url('././assets/zigzaglines_large.svg')] bg-cover  flex-grow xl:flex-grow-0   flex flex-col items-center justify-center shadow-md rounded-2xl gap-3 px-3 py-3 md:px-5 md:py-5 w-full md:w-full mt-5 ">
                        <h2 className="text-lg font-semibold text-gray-700">
                          Leave Balance
                        </h2>

                        <div className="w-full flex justify-between items-center bg-gradient-to-r bg-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200  cursor-pointer  rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 text-xl">🕺</span>
                            <p className="text-sm font-medium text-gray-800">
                              Casual Leave
                            </p>
                          </div>
                          <span className="text-blue-600 font-bold text-lg">
                            {/* {12 - casualleave} */}
                            {(leavedetails.settings?.[0]?.casual_leave ?? 0) -
                              leavedetails.cl}
                          </span>
                        </div>
                        {leavedetails.settings?.[0]?.unhappy_leave_option !==
                          "No" && (
                          <div className="w-full flex justify-between items-center bg-gradient-to-r bg-green-50 to-green-100 hover:from-green-100 hover:to-green-200  cursor-pointer rounded-xl px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 text-xl">😒</span>
                              <p className="text-sm font-medium text-gray-800">
                                Un Happy Leave
                              </p>
                            </div>
                            <span className="text-green-600 font-bold text-lg">
                              {(leavedetails.settings?.[0]?.unhappy_leave ??
                                0) - leavedetails.unHappy}
                            </span>
                          </div>
                        )}
                        <div className="w-full flex justify-between items-center bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 cursor-pointer rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 text-xl">🛠️</span>
                            <p className="text-sm font-medium text-gray-800">
                              Compensatory Leave
                            </p>
                          </div>
                          <span className="text-purple-600 font-bold text-lg">
                            {(leavedetails.settings?.[0]?.complementary_leave ??
                              0) - leavedetails.co}
                          </span>
                        </div>
                      </div>
                    </section>
                    <section className="mt-2">
                      {/* {upcomingHolidays?.length > 0 && ( */}
                      <div className="bg-[url('././assets/zigzaglines_large.svg')] rounded-2xl w-full px-3 py-3 md:px-5 md:py-5 bg-cover bg-no-repeat ">
                        {/* <p className="font-medium text-sm"></p> */}
                        <h2 className="text-lg font-semibold text-gray-800">
                          Upcoming Holidays
                        </h2>
                        <div className="flex flex-col gap-7 mt-3">
                          {upcomingHolidays?.upcomingHoliday?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex  items-center flex-wrap  gap-3"
                              >
                                <p className="rounded-full max-sm:hidden px-3 py-2 bg-black text-white">
                                  Thu
                                </p>
                                <p className="border-b-2 border-dashed max-sm:hidden flex-grow border-gray-700 "></p>
                                <p>
                                  {new Date(item.date)
                                    .toISOString()
                                    .slice(0, 10)}
                                </p>
                                {/* <p>2025-09-27</p> */}
                                <p className="border-b-2 flex-grow  border-dashed  border-gray-700 "></p>
                                <p className="rounded-full px-3 w-[40%] h-auto  text-center py-2 bg-black text-white">
                                  {item.reason}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                    </section>
                    {/* )} */}
                  </section>
                )}
              

                <div className="w-full md:w-[25%]">
                  {" "}
                  {upcomingBirthdays.length > 0 ? (
                    <div
                      ref={buttonRef}
                      onMouseEnter={handleConfetti}
                      className="bg-[#e4e0f3] text-[#5c3e98] rounded-2xl px-4 md:px-7 py-3 cursor-pointer group"
                    >
                      <p className="flex gap-1 font-semibold px-1 text-2xl font-serif">
                        Birthday's Today{" "}
                        <div className="  group-hover:animate-bounce duration-300">
                          🎉
                        </div>
                      </p>

                      <div className="flex flex-wrap gap-4 mt-4">
                        {upcomingBirthdays.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-3 mx-auto  bg-white  shadow-md"
                          >
                            <img
                              src={`${API_URL}api/uploads/${item.photo}`}
                              alt="Profile"
                              className="h-48 w-[220px] md:w-[260px] object-cover"
                            />
                            <div className=" flex flex-col justify-center text-center gap-1 mx-auto my-2 px-6 py-2 rounded-full">
                              <p className=" text-[14px] capitalize">
                                {item.employeeName}
                              </p>
                              <p className="text-[12px]  text-gray-500 capitalize">
                                {item.role?.name}
                              </p>
                              {/* <p className="font-semibold text-xs md:text-sm text-green-500">
                            {item.date_of_birth.split("-").reverse().join("-")}
                          </p> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* popup reliving */}
              </section>
            </div>
            {/* {role !== "Online Bidder" && (
            
            )} */}

            {/* {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-2xl shadow-lg w-[300px] md:w-[400px] p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Expected Employee Relieving
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Relieving Date
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={relievingDate}
                        onChange={(e) => setRelievingDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                   
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Reason<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

             
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowPopup(false)}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )} */}

            {/* {addWorkReportModalOpen && (
          <div className="fixed inset-0 min-h-screen bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div
              className="absolute inset-0 "
              onClick={closeWorkReportModal}
            ></div>
            <div
              className={`fixed top-0 right-0 px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10
min-h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeWorkReportModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="flex flex-wrap  flex-col md:flex-row justify-between">
                <p className="text-3xl font-medium mt-8">Work Report</p>
                <div className="flex justify-end gap-5 mt-8">
                  <button
                    onClick={closeWorkReportModal}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-600 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full">
                    Save
                  </button>
                </div>
              </div>

              <div className="flex  flex-col gap-5 mt-8">
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label
                      htmlFor="PROJECT TITLE"
                      className="font-medium text-sm"
                    >
                      PROJECT TITLE
                    </label>
                    <p className="text-sm">Job title</p>
                  </div>

                  <input
                    type="text"
                    id="PROJECT TITLE"
                    name="PROJECT TITLE"
                    placeholder="Enter Project title"
                    className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-full md:w-96"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="font-medium text-sm">
                      PERIOD OF PROJECT
                    </label>
                    <p className="text-sm">Period of project</p>
                  </div>

                  <div className="flex gap-5 w-full md:w-96">
                    <input
                      type="text"
                      placeholder="Start date"
                      className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-1/2 "
                    />

                    <input
                      type="text"
                      placeholder="End date"
                      className="border-2 rounded-xl ps-4 py-2 border-gray-300 outline-none h-10 w-1/2"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label
                      htmlFor="RESPONSIBILITIES"
                      className="font-medium text-sm"
                    >
                      RESPONSIBILITIES
                    </label>
                    <p className="text-sm">Short description about job</p>
                  </div>

                  <div className=" border-2 border-gray-300 rounded-2xl  w-full md:w-96">
                    <input
                      type="text"
                      placeholder="Add responsibility and press Enter"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={handleAddResponsibility}
                      className="w-full  h-10 rounded-md px-3 mt-3  border-none outline-none"
                    />
                    <ul className="mt-2">
                      {workReportForm.responsibilities.map((res, index) => (
                        <div className="flex items-start justify-between pe-5">
                          <li key={index}>
                            <p className="">
                              {" "}
                              <GoDotFill className="mr-2  inline-flex" />
                              {res}
                            </p>
                          </li>
                          <button
                            onClick={() => handleDeleteResponsibility(index)}
                            className="ml-2 text-red-500"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Dashboard_Mainbar;
