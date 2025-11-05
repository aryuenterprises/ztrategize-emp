import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { API_URL } from "../config";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const WorkFromHome_Mainbar = () => {
  const today = new Date().toISOString().split("T")[0];
  const [leaveType, setLeaveType] = useState("");
  const [LeaveFromDate, setLeaveFromDate] = useState(today);
  const [LeaveToDate, setLeaveToDate] = useState(today);
  const [LeaveReason, setLeaveReason] = useState("");
  const [EmployeeId, setEmployeeId] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");

  const [leaveTableList, setLeaveTableList] = useState([]);
  console.log("leaveTableList", leaveTableList);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");

  const [reasonVisible, setReasonVisible] = useState(false);
  const [reasonPopup, setReasonPopup] = useState("");

  const columns = [
    { field: "leaveType", header: "Work Type" },
    {
      field: "startDate",
      header: "From Date",
      body: (rowData) =>
        rowData.startDate.split("T")[0].split("-").reverse().join("-"),
    },
    {
      field: "endDate",
      header: "To Date",
      body: (rowData) =>
        rowData.endDate.split("T")[0].split("-").reverse().join("-"),
    },
    //  {
    //   field: "startTime",
    //   header: "From Time",

    //   body: (rowData) => rowData.startTime ?  rowData.startTime.slice(11,16) : "-",
    // },
    // {
    //   field: "endTime",
    //   header: "To Time",
    //   body: (rowData) => rowData.endTime ?  rowData.endTime.slice(11,16) : "-",
    // },
    {
      field: "leaveReason",
      header: "Reason",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              setReasonPopup(rowData?.leaveReason);
              setReasonVisible(true);
            }}
          >
            <FaEye />
            {/* {console.log("hello",rowData)} */}
          </button>
        );
      },
      //  body: (rowData) => <p className="capitalize">{rowData?.leaveReason}</p>
    },
    {
      field: "status",
      header: "status",
      body: (rowData) => <p className="capitalize">{rowData?.status}</p>,
    },
    // {
    //   field: "status",
    //   header: "Status",
    //   body: (rowData) => {
    //     const textAndBorderColor = rowData.status
    //       .toLowerCase()
    //       .includes("new leave")
    //       ? "blue"
    //       : rowData.status.toLowerCase().includes("approved")
    //       ? "#0EB01D"
    //       : rowData.status.toLowerCase().includes("pending")
    //       ? "#4E1BD9"
    //       : rowData.status.toLowerCase().includes("new leave")
    //       ? "#1F74EC"
    //       : "#BE6F00";
    //     return (
    //       <div
    //         style={{
    //           display: "inline-block",
    //           padding: "4px 8px",
    //           color: textAndBorderColor,
    //           border: `1px solid ${textAndBorderColor}`,
    //           borderRadius: "50px",
    //           textAlign: "center",
    //           width: "100px",
    //           fontSize: "10px",
    //           fontWeight: 700,
    //         }}
    //       >
    //         {rowData.status}
    //       </div>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setEmployeeId(user._id);
    const token = localStorage.getItem("hrms_employee_token");
    setToken(token);
    getLeaveDetails(user._id, token);
  }, []);

  const onClickSubmit = async () => {
    setButtonLoading(true);
    try {
      const today = new Date();
      const [startHours, startMinutes] = fromTime.split(":");
      const [endHours, endMinutes] = toTime.split(":");
      const startTime = new Date(today);
      startTime.setHours(parseInt(startHours));
      startTime.setMinutes(parseInt(startMinutes));
      startTime.setSeconds(0);
      const endTime = new Date(today);
      endTime.setHours(parseInt(endHours));
      endTime.setMinutes(parseInt(endMinutes));
      endTime.setSeconds(0);

      let payload = {
        employeeId: EmployeeId,
        leaveType: "wfh",
        startDate: LeaveFromDate,
        endDate: LeaveToDate,
        leaveReason: LeaveReason,
      };
      let response = await axios.post(
        `${API_URL}api/leave/apply-leave`,
        payload
        // {
        //   headers: {setLeaveTableList
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      // console.log("leave", response);
      getLeaveDetails(EmployeeId, token);
      setErrors("");
      setLeaveType("");
      const todayStr = today.toISOString().split("T")[0];
      setLeaveFromDate(todayStr);
      setLeaveToDate(todayStr);
      setLeaveReason("");
      setButtonLoading(false);
      toast.success("WFH applied successfully!");
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
      setButtonLoading(false);
    }
  };
  const [leavedetails, setLeavedetails] = useState([]);
  const wfhLeave =
    (leavedetails.settingWfh?.[0]?.wfh_leave ?? 0) -
    (leavedetails.wfhCount ?? 0);
  console.log("wfhLeave", wfhLeave);

  console.log("leavedetails", leavedetails);

  const getLeaveDetails = async (id, token) => {
    try {
      const response = await axios.get(
        `${API_URL}api/leave/leave-wfh-list/${id}`
      );
      console.log("response list", response);
      setLeaveTableList(response.data.data);
      setLeavedetails(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // const today = new Date().toISOString().split("T")[0];
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
    const value = e.target.value;
    setLeaveType(value);

    // Clear other values when switching type
    if (value == "Leave") {
      setFromTime("");
      setToTime("");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between overflow-hidden bg-gray-100 ">
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <ToastContainer />

        <div className="flex gap-2 items-center">
          <p className="text-sm text-blue-500">WFH</p>

          <p>{">"}</p>
        </div>
        <div className="flex flex-col bg-[url('././assets/zigzaglines_large.svg')] w-full  bg-no-repeat bg-cover bg-center rounded-3xl md:items-center md:justify-center bg-opacity-25 mt-8 px-5 py-3 ">
          <div className="flex justify-between items-center w-full mb-6">
            <p className="text-2xl md:text-3xl font-semibold">Work From Home</p>

            {/* WFH count card */}
            <div className="flex flex-col items-center">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white 
               flex flex-col items-center justify-center 
               px-2 py-3 rounded-2xl shadow-lg w-32"
              >
                <p className="text-xs font-medium">🏠 Available WFH</p>
                <span className="text-3xl font-bold mt-1">
                  {(leavedetails.settingWfh?.[0]?.wfh_leave ?? 0) -
                    leavedetails.wfhCount}
                </span>
              </div>

              {/* Alert message if WFH count is 0 */}
              {(leavedetails.settingWfh?.[0]?.wfh_leave ?? 0) -
                leavedetails.wfhCount <=
                0 && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Your WFH for this month is completed!
                </p>
              )}
            </div>
          </div>

          <div className=" flex w-full md:w-auto flex-col justify-center ">
            <div className="flex    flex-col gap-5 mt-5">
              {/* <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="PROJECT TITLE"
                    className="font-medium text-sm"
                  >
                    TYPE
                  </label>
                  <p className="text-sm">Select type</p>
                </div>

                <div className="flex flex-col gap-1">
                  <select
                    name=""
                    id=""
                    value={leaveType}
                    onChange={(e) => handleLeaveTypeChange(e)}
                    className="w-full md:w-80 lg:w-[520px] xl:w-96 border-2 rounded-xl ps-4  border-gray-200 h-10 cursor-pointer"
                  >
                    <option disabled selected={!leaveType} value="">
                      Select
                    </option>
                    <option value="Leave">Leave</option>
                    <option value="Permission">Permission</option>
                  </select>

                  {errors.leave_type && (
                    <p className="text-red-500 text-sm">
                      {errors.leave_type[0]}
                    </p>
                  )}
                </div>
              </div> */}

              {/* {leaveType === "Permission" && (
                <div className="flex flex-col md:flex-row gap-5 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="font-medium text-sm">
                      From & To Time
                    </label>
                    <p className="text-sm">Select Period</p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-2 md:gap-5 w-full md:w-80 lg:w-[520px] xl:w-96">
                    <div className="flex flex-col gap-1 lg:w-1/2">
                      <input
                        type="time"
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        className="border-2  rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                        placeholder="From Time"
                      />
                    </div>
                    <div className="flex flex-col gap-1 lg:w-1/2">
                      <input
                        type="time"
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        className="border-2  rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                        placeholder="To Time"
                      />
                    </div>
                  </div>
                </div>
              )} */}

              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="font-medium text-sm">From & To Date</label>
                  <p className="text-sm">Select Period</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-2 md:gap-5 w-full md:w-80 lg:w-[520px] xl:w-96">
                  <div className="flex flex-col gap-1 lg:w-1/2">
                    <input
                      name="from_date"
                      id="from_date"
                      type="date"
                      value={LeaveFromDate}
                      onChange={(e) => setLeaveFromDate(e.target.value)}
                      className="border-2  rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                      min={today}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 lg:w-1/2 ">
                    <input
                      name="to_date"
                      type="date"
                      value={LeaveToDate}
                      onChange={(e) => setLeaveToDate(e.target.value)}
                      className="border-2 rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                      min={LeaveFromDate}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="RESPONSIBILITIES"
                    className="font-medium text-sm"
                  >
                    Reason
                  </label>
                  <p className="text-sm">Short description</p>
                </div>

                <div className="flex flex-col">
                  <textarea
                    rows={3}
                    value={LeaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="The concise explanation for wfh, providing context for their absence"
                    className="border-2  border-gray-200 rounded-xl  w-full py-1  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                  />
                  {errors.leaveReason && (
                    <p className="text-red-500 text-sm">{errors.leaveReason}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={onClickSubmit}
                disabled={wfhLeave === 0 || buttonLoading}
                className={`text-white px-5 md:px-10 py-1 md:py-2.5 rounded-full
    ${
      wfhLeave === 0 || buttonLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
              >
                <div className="w-12 h-6 flex items-center justify-center">
                  {buttonLoading ? <ButtonLoader /> : "Submit"}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* <div style={{ width: "auto", margin: "0 auto" }}> */}
        <div className="w-full mx-auto relative">
          <div className="mt-8 flex justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md"
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
              value={leaveTableList}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // This makes the search work
              showGridlines
              resizableColumns
              emptyMessage="No Data Found"
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

          {reasonVisible ? (
            <>
              <div
                onClick={() => setReasonVisible(false)}
                className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-lg py-6 px-8 w-[800px] max-h-[500px] overflow-y-auto"
                >
                  <div className="flex items-center justify-between text-wrap">
                    <h2 className="text-xl font-semibold">Notes </h2>

                    <span
                      onClick={() => setReasonVisible(false)}
                      className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                    >
                      <IoClose />
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] break-words  ">
                    {reasonPopup}
                  </p>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkFromHome_Mainbar;
