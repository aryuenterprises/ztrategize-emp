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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const Leaves_Mainbar = () => {
  const today = new Date().toISOString().split("T")[0];

  
  const [EmployeeId, setEmployeeId] = useState("");
  const [token, setToken] = useState("");

  const [leaveTableList, setLeaveTableList] = useState([]);
  console.log("leaveTableList", leaveTableList);
  const [originalLeaveTableList, setOriginalLeaveTableList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");

  const [reasonVisible, setReasonVisible] = useState(false);
  const [reasonPopup, setReasonPopup] = useState("");

   const [notesVisible, setNotesVisible] = useState(false);
  const [notesPopup, setNotesPopup] = useState("");

  const columns = [
    { field: "leaveType", header: "Leave Type" },
     { field: "leaveCategory", header: "Leave Category",
      body: (rowData)=> <div className="uppercase">{rowData.leaveCategory}</div>
      },
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
    {
      field: "startTime",
      header: "From Time",

      body: (rowData) => (rowData.startTime ? rowData.startTime : "-"),
    },
    {
      field: "endTime",
      header: "To Time",
      body: (rowData) => (rowData.endTime ? rowData.endTime : "-"),
    },
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
    },
     {
      field: "note",
      header: "Notes",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              console.log("hello", rowData);
              setNotesPopup(rowData?.note);
              setNotesVisible(true);
            }}
          >
            <FaEye />
            {/* {console.log("hello",rowData)} */}
          </button>
        );
      },
    },
    {
      field: "status",
      header: "Status",
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

  async function handleSpecificLeaveType() {
    try {
      let response = await axios.get(`${API_URL}api/leaveType/get-leavetype`);
      console.log("gggg test ", response.data.data)
      SetSpecificLeaveType(response.data.data)
    }
    catch (error) {
      console.log('error');
    }
  }
  const [specificLeaveType, SetSpecificLeaveType] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setEmployeeId(user._id);
    const token = localStorage.getItem("hrms_employee_token");
    setToken(token);
    getLeaveDetails(user._id, token);
    handleSpecificLeaveType();
  }, []);


  const [leavedetails, setLeavedetails] = useState([]);
 
  const getLeaveDetails = async (id, token) => {
    try {
      const response = await axios.get(
        `${API_URL}api/leave/particular-leavelist`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          params: {
            id,
          },
        }
      );
      // console.log("attendance list", response.data);
      setLeaveTableList(response.data.data);
      setOriginalLeaveTableList(response.data.data);
      setLeavedetails(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };



  const typeFilter = (type) => {
    if (type === "") {
      setLeaveTableList(originalLeaveTableList); // reset if nothing selected
    } else {
      const filtered = originalLeaveTableList.filter(
        (item) => item.leaveType === type
      );
      setLeaveTableList(filtered);
    }
  };

  const validationSchema = Yup.object().shape({
    leaveType: Yup.string().required("Leave type is required"),
    leaveCategory: Yup.string().when("leaveType",{
      is: (val)=> val === "Leave",
      then: (schema) => schema.required("Leave category is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    fromTime: Yup.string().when("leaveType", {
      is: (val) => val === "Permission",
      then: (schema) => schema.required("From time is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    toTime: Yup.string().when("leaveType", {
      is: (val) => val === "Permission",
      then: (schema) => schema.required("To time is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    LeaveFromDate: Yup.date()
      .required("From date is required")
      .typeError("Invalid date"),

    LeaveToDate: Yup.date()
      .required("To date is required")
      .typeError("Invalid date")
      .min(Yup.ref("LeaveFromDate"), "To date cannot be before from date"),

    LeaveReason: Yup.string()
      .required("Reason is required")
      .min(5, "Reason must be at least 5 characters"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      leaveType: "",
      leaveCategory: "",
      fromTime: "",
      toTime: "",
      LeaveFromDate: today,
      LeaveToDate: today,
      LeaveReason: "",
    },
  });

  const leaveType = watch("leaveType");

  useEffect(() => {
    if (leaveType === "Permission") {
      trigger(["fromTime", "toTime"]);
    }
  }, [leaveType, trigger]);

  const onSubmit = async (data) => {
    setButtonLoading(true);
    const today = new Date();
    const [startHours, startMinutes] = data.fromTime.split(":");
    const [endHours, endMinutes] = data.toTime.split(":");
    const startTime = new Date(today);
    startTime.setHours(parseInt(startHours));
    startTime.setMinutes(parseInt(startMinutes));
    startTime.setSeconds(0);
    const endTime = new Date(today);
    endTime.setHours(parseInt(endHours));
    endTime.setMinutes(parseInt(endMinutes));
    endTime.setSeconds(0);
    try {
      // Build payload directly from data (no useState)
      const payload = {
        employeeId: EmployeeId,
        leaveType: data.leaveType,
        leaveCategory: data.leaveType == "Leave" ? data.leaveCategory : null,
        startDate: data.LeaveFromDate,
        endDate: data.LeaveToDate,
        leaveReason: data.LeaveReason,
        startTime: data.leaveType == "Permission" ? startTime : null,
        endTime: data.leaveType == "Permission" ? endTime : null,
      };

      await axios.post(`${API_URL}api/leave/apply-leave`, payload);
      toast.success("Leave applied successfully!");
      reset();
      getLeaveDetails(EmployeeId, token);
      setButtonLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply leave");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between overflow-hidden bg-gray-100 ">
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <ToastContainer />

        <div className="flex gap-2 items-center">
          <p className="text-sm text-blue-500">Leaves</p>
          <p>{">"}</p>
        </div>
        <div className="flex flex-col bg-[url('././assets/zigzaglines_large.svg')] w-full  bg-no-repeat bg-cover bg-center rounded-3xl md:items-center md:justify-center bg-opacity-25 mt-8 px-5 py-3 ">
          <div className="flex flex-wrap justify-between items-center w-full mb-6">
            <p className="text-2xl md:text-3xl font-semibold">Leaves</p>

            {/* Leave balances */}
            <div className="flex flex-wrap pt-2 md:pt-0  gap-4">
              {/* Casual Leave */}
              <div
                className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white 
                     px-2 py-3 rounded-2xl shadow-lg w-28"
              >
                <p className="text-xs font-medium">🏖️ Casual Leave</p>
                <span className="text-2xl font-bold mt-1">
                  {(leavedetails.leaveSettings?.[0]?.casual_leave ?? 0) -
                    leavedetails?.cl}
                </span>
              </div>

              {/* Comp Off */}
              <div
                className="flex flex-col items-center bg-gradient-to-r from-green-400 to-green-600 text-white 
                    px-2 py-3 rounded-2xl shadow-lg w-28"
              >
                <p className="text-xs font-medium">⏰ Comp Off</p>
                <span className="text-2xl font-bold mt-1">
                  {(leavedetails.leaveSettings?.[0]?.complementary_leave ?? 0) -
                    leavedetails?.co}
                </span>
              </div>

              {/* Unhappy Leave */}
              {leavedetails.leaveSettings?.[0]?.unhappy_leave_option !==
                "No" && (
                <div
                  className="flex flex-col items-center bg-gradient-to-r from-red-400 to-red-600 text-white 
                    px-1 py-3 rounded-2xl shadow-lg w-28"
                >
                  <p className="text-xs font-medium">😔 Unhappy Leave</p>
                  <span className="text-2xl font-bold mt-1">
                    {(leavedetails.leaveSettings?.[0]?.unhappy_leave ?? 0) -
                      leavedetails?.unHappy}
                  </span>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full md:w-auto flex-col justify-center"
          >
            <div className="flex flex-col gap-5 mt-5">
              {/* Leave Type */}
              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="font-medium text-sm">Type</label>
                  <p className="text-sm">Select Type</p>
                </div>

                <div className="flex flex-col gap-1">
                  <select
                    {...register("leaveType")}
                    className="w-full md:w-80 lg:w-[520px] xl:w-96 border-2 rounded-xl ps-4 border-gray-200 h-10 cursor-pointer"
                  >
                    <option value="">Select Type</option>
                    <option value="Leave">Leave</option>
                    <option value="Permission">Permission</option>
                  </select>
                  {errors.leaveType && (
                    <p className="text-red-500 text-sm">
                      {errors.leaveType.message}
                    </p>
                  )}
                </div>
              </div>

              {leaveType === "Leave" && (
                <div className="flex flex-col md:flex-row gap-5 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label
                      htmlFor="PROJECT TITLE"
                      className="font-medium text-sm"
                    >
                      Leave Category
                    </label>
                    <p className="text-sm">Select Type</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <select {...register("leaveCategory")} className="w-full md:w-80 lg:w-[520px] xl:w-96 border-2 rounded-xl ps-4  border-gray-200 h-10 cursor-pointer">
                      <option value="">Select a leave type</option>
                      {specificLeaveType.map((value) => (
                        <option key={value._id} value={value.shotKey}>
                          {value.type}
                        </option>
                      ))}
                    </select>
                     {errors.leaveCategory && (
                    <p className="text-red-500 text-sm">
                      {errors.leaveCategory.message}
                    </p>
                  )}
                  </div>
                </div>
              )}

              {/* Time Fields - only for Permission */}
              {leaveType === "Permission" && (
                <div className="flex flex-col md:flex-row gap-5 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="font-medium text-sm">
                      FROM & TO TIME
                    </label>
                    <p className="text-sm">Select Period</p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-2 md:gap-5 w-full md:w-80 lg:w-[520px] xl:w-96">
                    <div className="flex flex-col gap-1 lg:w-1/2">
                      <input
                        type="time"
                        {...register("fromTime")}
                        className="border-2 rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                      />
                      {errors.fromTime && (
                        <p className="text-red-500 text-sm">
                          {errors.fromTime.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 lg:w-1/2">
                      <input
                        type="time"
                        {...register("toTime")}
                        className="border-2 rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                      />
                      {errors.toTime && (
                        <p className="text-red-500 text-sm">
                          {errors.toTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* From & To Date */}
              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="font-medium text-sm">From & To Date</label>
                  <p className="text-sm">Select Period</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-2 md:gap-5 w-full md:w-80 lg:w-[520px] xl:w-96">
                  <div className="flex flex-col gap-1 lg:w-1/2">
                    <input
                      type="date"
                      {...register("LeaveFromDate")}
                      min={today}
                      className="border-2 rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                    />
                    {errors.LeaveFromDate && (
                      <p className="text-red-500 text-sm">
                        {errors.LeaveFromDate.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 lg:w-1/2">
                    <input
                      type="date"
                      {...register("LeaveToDate")}
                      className="border-2 rounded-xl px-2 py-2 border-gray-200 outline-none h-10 cursor-pointer"
                    />
                    {errors.LeaveToDate && (
                      <p className="text-red-500 text-sm">
                        {errors.LeaveToDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col md:flex-row gap-5 justify-between">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="font-medium text-sm">Reason</label>
                  <p className="text-sm">Short Description</p>
                </div>

                <div className="flex flex-col">
                  <textarea
                    rows={3}
                    {...register("LeaveReason")}
                    placeholder="The concise explanation for leave, providing context for their absence"
                    className="border-2 border-gray-200 rounded-xl w-full py-1 md:w-80 lg:w-[520px] xl:w-96 px-3"
                  />
                  {errors.LeaveReason && (
                    <p className="text-red-500 text-sm">
                      {errors.LeaveReason.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 md:px-10 py-1 md:py-2.5 rounded-full"
              >
                <div className="w-12 h-6 flex items-center justify-center">
                  {buttonLoading ? <ButtonLoader /> : "Submit"}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* <div style={{ width: "auto", margin: "0 auto" }}> */}
        <div className="w-full md:mx-auto relative">
          <div className="mt-8 flex justify-end gap-2 md:gap-4">
            <select
              name=""
              id=""
              className="outline-none md:px-2 cursor-pointer"
              onClick={(e) => typeFilter(e.target.value)}
            >
              <option value="" selected>
                Select a Type
              </option>
              <option value="Leave">Leave</option>
              <option value="Permission">Permission</option>
            </select>
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder=" Search"
              className="md:px-2 py-2 rounded-md"
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

           {notesVisible ? (
            <>
              <div
                onClick={() => setNotesVisible(false)}
                className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-lg py-6 px-8 w-[800px] max-h-[500px] overflow-y-auto"
                >
                  <div className="flex items-center justify-between text-wrap">
                    <h2 className="text-xl font-semibold">Notes </h2>

                    <span
                      onClick={() => setNotesVisible(false)}
                      className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                    >
                      <IoClose />
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] break-words  ">
                    {notesPopup}
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

export default Leaves_Mainbar;
