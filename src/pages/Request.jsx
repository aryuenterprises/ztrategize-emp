import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import Footer from "../components/Footer";
import { API_URL } from "../components/config";
import axios from "axios";
import ButtonLoader from "../components/ButtonLoader";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Dropdown } from "primereact/dropdown";

const Request = () => {
  const [customSubject, setCustomSubject] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [EmployeeId, setEmployeeId] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const [leaveTableList, setLeaveTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");

  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [messagePopup, setMessagePopup] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  const columns = [
    {
      field: "date",
      header: "Date",
      body: (rowData) => (
        <p>{rowData.date.split("T")[0].split("-").reverse().join("-")}</p>
      ),
    },
    {
      header: "Subject",
      body: (rowData) =>
        (rowData.subject === "Other") && (rowData.customSubject.length > 0) ? rowData.customSubject : rowData.subject,
    },
    {
      field: "message",
      header: "Message",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              setMessagePopup(rowData);
              setMessageVisible(true);
            }}
          >
            <FaEye />
          </button>
        );
      },
    },
    {
      field: "notes",
      header: "Notes",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              console.log("hello", rowData);
              setNotes(rowData);
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
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    setEmployeeId(user._id);
    const token = localStorage.getItem("hrms_employee_token");
    setToken(token);
    getrequestDetails(user._id, token);
  }, []);



const onClickSubmit = async () => {
  const trimmedMessage = message.trim();
  let newErrors = {}; 


  if (!subject) {
    newErrors.subject = "Select a subject";
  }

  
  if (trimmedMessage === "") {
    newErrors.message = "Enter message";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    if (newErrors.subject && newErrors.message) {
      toast.error("Please select a subject and enter a valid message!");
    } else if (newErrors.subject) {
      toast.error("Please select a subject!");
    } else if (newErrors.message) {
      toast.error("Please enter a valid message!");
    }
    return;
  }

  setButtonLoading(true);
  const employeeId = JSON.parse(localStorage.getItem("hrms_employee"))._id;

  try {
    let payload = {
      employeeId: employeeId,
      date: new Date(),
      subject,
      message: trimmedMessage,
      customSubject: subject === "Other" ? customSubject : "",
    };

    let response = await axios.post(
      `${API_URL}api/employeeRequest/create-employeerequest`,
      payload
    );

    setErrors("");
    setMessage("");
    setSubject("");
    setCustomSubject("");
    setButtonLoading(false);

    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    const token = localStorage.getItem("hrms_employee_token");
    getrequestDetails(user._id, token);

    toast.success("Request submitted successfully!");
  } catch (error) {
    console.log(error);
    setErrors(error.response?.data?.errors || {});
    setButtonLoading(false);
  }
};


  // const onClickSubmit = async () => {
  //   setButtonLoading(true);
  //   const employeeId = JSON.parse(localStorage.getItem("hrms_employee"))._id;
  //   try {
  //     let payload = {
  //       employeeId: employeeId,
  //       date: new Date(),
  //       subject,
  //       message,
  //       customSubject: subject === "Other" ? customSubject : "",
  //     };
  //     let response = await axios.post(
  //       `${API_URL}api/employeeRequest/create-employeerequest`,
  //       payload
  //       // {
  //       //   headers: {setLeaveTableList
  //       //     Authorization: `Bearer ${token}`,
  //       //   },
  //       // }
  //     );

  //     setErrors("");
  //     setMessage("");
  //     setSubject("");

  //     setButtonLoading(false);

  //     const user = JSON.parse(localStorage.getItem("hrms_employee"));
  //     const token = localStorage.getItem("hrms_employee_token");
  //     getrequestDetails(user._id, token);

  //     toast.success("Request Submited successfully!");
  //   } catch (error) {
  //     console.log(error);
  //     setErrors(error.response.data.errors);
  //     setButtonLoading(false);
  //   }
  // };

  const getrequestDetails = async (id, token) => {
    try {
      const response = await axios.get(
        `${API_URL}api/employeeRequest/view-employeerequest/${id}`
      );
      console.log("attendance list", response.data);
      setLeaveTableList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const subjectOptions = [
    { label: 'Select subject', value: '', disabled: true },
    { label: "Timing", value: "Timing" },
    { label: "Technical", value: "Technical" },
    { label: "Report", value: "Report" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <div className="min-h-screen w-screen flex flex-col justify-between overflow-hidden bg-gray-100 ">
        <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
          <Mobile_Sidebar />

          <ToastContainer />

          <div className="flex gap-2 items-center">
            <p className="text-sm text-blue-500">Request</p>
            <p>{">"}</p>
          </div>
          <div className="flex flex-col bg-[url('././assets/zigzaglines_large.svg')] w-full  bg-no-repeat bg-cover bg-center rounded-3xl md:items-center md:justify-center bg-opacity-25 mt-8 px-5 py-3 ">
            <p className="text-2xl md:text-3xl w-full font-semibold">Request</p>

            <div className=" flex w-full md:w-auto flex-col justify-center ">
              <div className="flex    flex-col gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="font-medium text-md">Subject</label>
                  </div>

                  <div className="flex flex-col">
                    {/* Dropdown select for subject */}
                    <Dropdown
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.value)}
                      options={subjectOptions}
                      placeholder="Select subject"
                      className="border-2 outline-none border-gray-200 rounded-xl w-full px-2 md:w-80 lg:w-[520px] xl:w-96 "
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm">{errors.subject}</p>
                    )}
                  </div>

                  {/* Show custom input if 'Other' is selected */}
                  {subject === "Other" && (
                    <div className="flex flex-col mt-2">
                      <input
                        name="custom_subject"
                        id="custom_subject"
                        type="text"
                        placeholder="Enter custom subject"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="border-2 outline-none border-gray-200 rounded-xl w-full py-2 md:w-80 lg:w-[520px] xl:w-96 px-3"
                      />
                      {errors.message && (
                        <p className="text-red-600 font-semibold text-sm mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label
                      htmlFor="RESPONSIBILITIES"
                      className="font-medium text-md"
                    >
                      Message
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a message..."
                      className="border-2 outline-none  border-gray-200 rounded-xl  w-full py-1  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm">{errors.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 mb-3">
                <button
                  onClick={onClickSubmit}
                  className="bg-blue-500 hover:bg-blue-600   text-white px-5 md:px-10 py-1 md:py-2.5  rounded-full"
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

          {notesVisible ? (
            <>
              <div
                onClick={() => setNotesVisible(!notesVisible)}
                className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-lg py-6 px-8 w-[800px] max-h-[500px] overflow-y-auto"
                >
                  <div className="flex items-center justify-between text-wrap">
                    <h2 className="text-xl font-semibold">Notes </h2>

                    <span
                      onClick={() => setNotesVisible(!notesVisible)}
                      className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                    >
                      <IoClose />
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] break-words  ">
                    {notes.notes}
                  </p>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {messageVisible ? (
            <>
              <div
                onClick={() => setMessageVisible(false)}
                className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-lg py-6 px-8 w-[800px] max-h-[500px] overflow-y-auto"
                >
                  <div className="flex items-center justify-between text-wrap">
                    <h2 className="text-xl font-semibold">Message </h2>

                    <span
                      onClick={() => setMessageVisible(false)}
                      className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                    >
                      <IoClose />
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] break-words  ">
                    {messagePopup.message}
                  </p>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Request;
