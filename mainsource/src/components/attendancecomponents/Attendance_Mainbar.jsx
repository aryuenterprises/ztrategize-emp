import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { useState, useEffect, useRef } from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import axios from "axios";
import { API_URL } from "../config";
import ButtonLoader from "../ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Attendance_Mainbar = () => {
  let navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);

  // this is the time update function
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = ` ${now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}`;
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()}`;
      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    };

    updateTime(); // Initial call to set time immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const [shift, setShift] = useState("Day Shift");
  const [workType, setWorkType] = useState("");
  const [reason, setReason] = useState("");
  const [reason2, setReason2] = useState("");
  const [EmployeeId, setEmployeeId] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const [attendanceTableList, setAttendanceTableList] = useState([]);
  const [lastLoginReasonFromApi, setLastLoginReasonFromApi] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  // this useeffect is the used to  employee id and token
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setEmployeeId(user._id);
    const token = localStorage.getItem("hrms_employee_token");
    setToken(token);
    getAttendanceDetails(user._id, token);
   
    // setLocalStorageAttendanceReason(localStorage.getItem("attendanceReason"));
  }, []);

  const [globalFilter, setGlobalFilter] = useState("");

  const attendanceTable = attendanceTableList.flatMap((attendance) => {
    return attendance.entries.map((entry) => {
      const dateObj = new Date(entry.time);
      const date =dateObj.toISOString().split("T")[0]
      return {
        data: date.split("-").reverse().join("-"), // "2025-07-08"
        entry_time: dateObj.toLocaleTimeString(), // "10:41:01 AM"
        comand: entry.reason, // "Break In", etc.
      };
    });
  });

  const columns = [
    { field: "data", header: "Attendance Date" },
    { field: "entry_time", header: "Attendance Time" },
    { field: "comand", header: "Reason" , body: (rowData) => <div className="capitalize">{rowData.comand == "Break Out" ? "Start Break" : rowData.comand == "Break In" ? "End Break" : rowData.comand}</div>},
  ];

  const onClickSubmit = async () => {
    setButtonLoading(true);
     
    try {
      let payload = {
        dateTime: new Date().toISOString(),
        employeeId: EmployeeId,
        comments: "hello",
        shift: shift,
        workType: workType,
        reason: reason,
      };

      const response = await axios.post(
        `${API_URL}api/attendance/mark`,
        payload
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      setErrors("");
      setReason("");
      getAttendanceDetails(EmployeeId, token);
      setReason2(reason);
      setButtonLoading(false);
      // console.log("submit response", response);

      toast.success("Attendance marked successfully!");
      // setButtonLoading(false)
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
      setButtonLoading(false);
    }
  };

  const getAttendanceDetails = async (id, token) => {
    setButtonLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}api/attendance/attendancelist`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          params: {
            // employeeId: id,
            employeeId: id,
          },
        }
      );

      // console.log("reson", response?.data);

      setAttendanceTableList(response.data.data);
      setLoading(false);
      getAttendanceReasonFromApi(response.data.data);
     
      setReason("");
      setButtonLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getAttendanceReasonFromApi = (response) => {
    // console.log("login response", response);
    if (response.length > 0) {
      const latestEntries = response[0]?.entries || [];
      if (latestEntries.length > 0) {
        const lastEntry = latestEntries[0];
        // console.log("Last entry reason:", lastEntry.reason);
        setLastLoginReasonFromApi(lastEntry.reason);
      } else {
        console.log("No entries found in latest attendance record.");
      }
    } else {
      setLastLoginReasonFromApi("");
      console.log("No attendance data found.");
    }

    // if (response.length > 0) {
    //    console.log("login response jjjj",response[0]?.entrie[0]?.reason);
    //   setLastLoginReasonFromApi(response.reverse()[0].reason);
    // } else {
    //   setLastLoginReasonFromApi("");
    // }
  };

  const onChangeReason = (value) => {
    setReason(value);
  };

  const [time, setTime] = useState(() => {
    const savedValue = localStorage.getItem("stopwatchValue");
    return savedValue ? parseInt(savedValue, 10) : 0;
  });

  const startInterval = () => {
    if (!window.stopwatchInterval) {
      window.stopwatchInterval = setInterval(() => {
        const start = parseInt(localStorage.getItem("stopwatchStart"), 10);
        if (start) {
          const currentTime = Date.now() - start;
          localStorage.setItem("stopwatchValue", currentTime);
          window.dispatchEvent(new Event("stopwatchUpdate")); // Notify all components
        }
      }, 1000);
    }
  };

  const startStopwatch = () => {
    const startTime = localStorage.getItem("stopwatchStart");
    const pausedTime = localStorage.getItem("pausedTime");

    if (pausedTime) {
      localStorage.setItem(
        "stopwatchStart",
        Date.now() - parseInt(pausedTime, 10)
      );
      localStorage.removeItem("pausedTime");
    } else if (!startTime) {
      localStorage.setItem("stopwatchStart", Date.now());
    }

    startInterval();
  };

  const pauseStopwatch = () => {
    clearInterval(window.stopwatchInterval);
    window.stopwatchInterval = null;
    const currentValue = parseInt(localStorage.getItem("stopwatchValue"), 10);
    localStorage.setItem("pausedTime", currentValue);
  };

  const stopStopwatch = () => {
    clearInterval(window.stopwatchInterval);
    window.stopwatchInterval = null;
    localStorage.removeItem("stopwatchStart");
    localStorage.removeItem("stopwatchValue");
    localStorage.removeItem("pausedTime");
    window.dispatchEvent(new Event("stopwatchUpdate"));
  };

  useEffect(() => {
    const updateTime = () => {
      const savedValue = localStorage.getItem("stopwatchValue");
      if (savedValue) setTime(parseInt(savedValue, 10));
      else setTime(0);
    };

    updateTime();
    window.addEventListener("stopwatchUpdate", updateTime);

    // On page reload, check if stopwatch is running and restart interval
    const startTime = localStorage.getItem("stopwatchStart");
    const pausedTime = localStorage.getItem("pausedTime");
    if (startTime && !pausedTime) {
      startInterval(); // Restart interval if stopwatch is running
    }
    // console.log(reason2);

    if (reason2 === "Login" || reason2 === "Break In") {
      startStopwatch();
    } else if (reason2 === "Break Out") {
      pauseStopwatch();
    } else if (reason2 === "Logout") {
      stopStopwatch();
    }

    return () => {
      window.removeEventListener("stopwatchUpdate", updateTime);
    };
  }, [reason2]);
  // console.log("hhhh",attendanceTableList);

  function onClickMonthlyDetails() {
    navigate("/monthlyattendancedetails");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }


  useEffect(() => {
  if (attendanceTableList.length > 0 && !workType) {
    setWorkType(attendanceTableList[0].workType);
  }
}, [attendanceTableList]);

  return (
    <div className=" w-screen min-h-screen overflow-x-hidden flex flex-col justify-between bg-gray-100 ">
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <ToastContainer />
        <div className="flex gap-2 items-center">
          <p className="text-sm text-blue-500">Attendance</p>
          <p>{">"}</p>
        </div>

        <section className="flex flex-col md:flex-row justify-end ">
          <button
            onClick={onClickMonthlyDetails}
            className="px-2 py-1 md:px-4 md:py-2 mt-5 md:mt-8 w-fit cursor-pointer rounded-full text-white bg-blue-500 hover:bg-blue-600 duration-300  font-medium"
          >
            Monthly Details
          </button>
        </section>

        <div className="bg-[url('././assets/zigzaglines_large.svg')]  bg-no-repeat bg-cover bg-center rounded-3xl bg-opacity-25 mt-8 px-5 py-3">
          <p className="text-2xl md:text-3xl font-semibold">Attendance</p>

          <div className="flex w-full mt-5 justify-center items-center">
            <div className="flex flex-col gap-5">
              {/* current time & date */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-x-8 justify-between">
                <p>Current Date & time</p>
                <input
                  type="text"
                  name=""
                  id=""
                  readOnly
                  value={`${currentDate} ${currentTime}`}
                  className="border w-full md:w-96 rounded-md py-1 px-2 h-10 outline-none"
                />
              </div>

              {/* shift */}
              <div className="flex flex-col sm:flex-row gap-x-8 justify-between">
                <p>Shift</p>
                <div className="flex gap-8 w-full md:w-96">
                  <div className="flex gap-1">
                    <input
                      type="radio"
                      name="Day Shift"
                      id="Day Shift"
                      value="Day Shift"
                      onChange={(e) => setShift(e.target.value)}
                      checked={shift === "Day Shift"}
                    />
                    <label htmlFor="Day Shift">Day Shift</label>
                  </div>

                  {/* <div className="flex gap-1">
                    <input
                      type="radio"
                      name="Night Shift"
                      id="Night Shift"
                      value="Night Shift"
                      onChange={(e) => setShift(e.target.value)}
                      checked={shift === "Night Shift"}
                    />
                    <label htmlFor="Night Shift">Night Shift</label>
                  </div> */}
                </div>
              </div>

              {/* work type */}
              <div className="flex flex-col sm:flex-row gap-x-8 justify-between">
                <div className="">
                  <p>Work Type</p>
                  {errors?.workType && (
                    <p className="text-red-500">{errors.workType}</p>
                  )}
                </div>
                <div className="flex gap-8 w-full md:w-96">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="workType" // ✅ Same name for both radios
                      id="WFO"
                      value="WFO"
                      onChange={(e) => setWorkType(e.target.value)}
                      checked={workType === "WFO"}
                      disabled={attendanceTableList[0]?.workType === "WFH" ? true : false  }
                    />
                    <label htmlFor="WFO">WFO</label>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="workType" // ✅ Same name
                      id="WFH"
                      value="WFH"
                      onChange={(e) => setWorkType(e.target.value)}
                      checked={workType === "WFH"}
                      disabled={attendanceTableList[0]?.workType === "WFO" ? true : false }
                    />
                    <label htmlFor="WFH">WFH</label>
                  </div>
                </div>
              </div>

              {/* reason */}
              {/* <div className="flex flex-col  lg:flex-row lg:items-center  gap-x-8 justify-between">
                <p>Reason</p>
                <div className="flex flex-col gap-1">
                  <select
                    name="reason"
                    id="reason"
                    className="border w-full py-1 px-2 md:w-96 h-10 rounded-md outline-none"
                    onChange={(e) => onChangeReason(e.target.value)}
                  >
                    <option
                      selected={!reason}
                      value=""
                      disabled
                      className={`${
                        errors.reason ? "text-red-500" : "text-black"
                      }`}
                    >
                      Select
                    </option>

                    {lastLoginReasonFromApi === "" && (
                      <option value="Login">Login</option>
                    )}

                    {lastLoginReasonFromApi !== "" && (
                      <>
                        <option value="Break Out">Break Out</option>
                        <option value="Break In">Break In</option>
                        <option value="Logout">Logout</option>
                      </>
                    )}
                  </select>
                  {errors.reason && (
                    <p className="text-red-500">{errors.reason}</p>
                  )}
                </div>
              </div> */}

              {/* reason */}
              <div className="flex flex-col  lg:flex-row lg:items-center  gap-x-8 justify-between">
                <p>Reason</p>
                <div className="flex flex-col gap-1">
                  <select
                    name="reason"
                    id="reason"
                    className="border w-full py-1 px-2 md:w-96 h-10 rounded-md outline-none cursor-pointer"
                    onChange={(e) => onChangeReason(e.target.value)}
                  >
                    <option
                      selected={!reason}
                      value=""
                      disabled
                      className={`${
                        errors.reason ? "text-red-500" : "text-black"
                      }`}
                    >
                      Select
                    </option>
                    {lastLoginReasonFromApi === "Login" ? (
                      <>
                        <option value="Break Out" className="cursor-pointer">Start Break</option>
                        <option value="Logout" className="cursor-pointer">Logout</option>
                      </>
                    ) : lastLoginReasonFromApi === "Break Out" ? (
                      <>
                        <option value="Break In" className="cursor-pointer">End Break</option>
                        {/* <option value="Logout">Logout</option> */}
                      </>
                    ) : lastLoginReasonFromApi === "Break In" ? (
                      <>
                        <option value="Break Out" className="cursor-pointer">Start Break</option>
                        <option value="Logout" className="cursor-pointer">Logout</option>
                      </>
                    ) : (
                      <option value="Login" className="cursor-pointer">Login</option>
                    )}
                  </select>
                  {errors?.reason && (
                    <p className="text-red-500">{errors.reason}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={onClickSubmit}
                  className="bg-blue-500 hover:bg-blue-600 hidden md:block text-white px-5 md:px-10 py-1 md:py-2.5  rounded-full"
                >
                  <div className="w-12 h-6 flex items-center justify-center">
                    {buttonLoading ? <ButtonLoader /> : "Submit"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "auto", margin: "0 auto" }}>
          {/* Global Search Input */}
          <div className="mt-8 flex justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-5 py-2 md:px-2 md:py-2 rounded-md"
            />
          </div>

          {/* Table Container with Relative Position */}
          <div className="relative mt-4">
            {/* Loader Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            )}
            <DataTable
              className="mt-8"
              value={attendanceTable}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // This makes the search work
              showGridlines
              resizableColumns
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word", // Allow text to wrap
                    overflow: "hidden", // Prevent text overflow
                    whiteSpace: "normal", // Ensure that text wraps within the available space }}
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Attendance_Mainbar;
