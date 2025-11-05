import React from "react";
import { useState, useEffect, useRef } from "react";

import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";

// files
import { API_URL } from "../config";
import axios from "axios";
import PDF from "../../assets/document/pdf.svg";
import Excel from "../../assets/document/excel.svg";
import ppt from "../../assets/document/ppt.svg";
import Word from "../../assets/document/word.svg";
import Image from "../../assets/document/image.svg";
import Sav from "../../assets/document/sav-file-format.png";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../StringCaps";
import { dateFormat } from "../../dateformat";
import Swal from "sweetalert2";
import { FaEye, FaPlus } from "react-icons/fa";
import { LuLogs } from "react-icons/lu";

import { saveAs } from "file-saver";
import Papa from "papaparse";
import { FaFileExport } from "react-icons/fa6";
import DOMPurify from "dompurify";
import { FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext"; // PrimeReact InputText
import { HiOutlineArrowTurnUpLeft } from "react-icons/hi2";
import { PiFlagPennantFill } from "react-icons/pi";
import { AiFillDelete, AiTwotoneDelete } from "react-icons/ai";

function Task_view_all() {
  const employeeDetails = JSON.parse(localStorage.getItem("hrms_employee"));
  // console.log("employeeDetails:", employeeDetails.email);

  const employeeemail = employeeDetails.email;
  const employeeId = employeeDetails._id;
  console.log("employeeId", employeeId);
  const { taskId } = useParams();

  // console.log("Task ID:", taskId);

  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  // console.log("status",status);
  const [startTime, setStartTime] = useState("");
  // console.log("startTime", startTime);

  const [stopTime, setStopTime] = useState("");

  // const handleStatusChange = (e) => {
  //   const newStatus = e.target.value;
  //   setStatus(newStatus);

  //   const now = new Date().toISOString(); // Full ISO timestamp

  //   if (newStatus === "In Progress" && !startTime) {
  //     setStartTime(now);
  //   } else if (newStatus === "Review" && !stopTime) {
  //     setStopTime(now);
  //   }
  // };

  //   files all icon

  const getFileIcon = (type) => {
    const imageFormats = [
      "jpg",
      "png",
      "gif",
      "jpeg",
      "svg",
      "txt",
      "PNG",
      "JPG",
      "SVG",
      "webp",
    ];
    const excelFormats = ["xlsx", "xls", "csv"];
    const wordFormats = ["docx", "doc", "word"];
    const pptFormats = ["ppt", "pptx"];
    const SavFormats = ["sav"];

    const commonClass = "w-7 h-7 object-contain";

    if (imageFormats.includes(type)) {
      return <img src={Image} className={commonClass} alt="Image" />;
    }
    if (SavFormats.includes(type)) {
      return <img src={Sav} className={commonClass} alt="Image" />;
    }

    if (excelFormats.includes(type)) {
      return <img src={Excel} className={commonClass} alt="Excel" />;
    }

    if (wordFormats.includes(type)) {
      return <img src={Word} className={commonClass} alt="Word" />;
    }

    if (pptFormats.includes(type)) {
      return <img src={ppt} className={commonClass} alt="ppt" />;
    }

    if (type === "pdf") {
      return <img src={PDF} className={commonClass} alt="PDF" />;
    }

    return null;
  };

  // all data fetch in api to taskid

  const [alldata, setAlldata] = useState([]);
  console.log("alldata", alldata);

  // const [projectManager,setProjectManager]

  const [pauseProject, setpauseProject] = useState("");
  // console.log("pauseProject",pauseProject);

  const [holddata, setHolddata] = useState([]);

  const [projectManager, setProjectManager] = useState([]);

  console.log("projectManager", projectManager);

  // console.log("alldata", alldata);
  const [subTasks, setSubTasks] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const fetchProjectall = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/task/particular-task/${taskId}`
      );
      // console.log(response);
      if (response.data.success) {
        setAlldata(response?.data?.data);
        setStatus(response?.data?.data?.status);
        setStartTime(response?.data?.data?.startTime);
        setStopTime(response?.data?.data?.endTime);
        const pauseComments = response?.data?.data?.pauseComments;
        if (pauseComments && pauseComments.length > 0) {
          const lastPauseCondition =
            pauseComments[pauseComments.length - 1].pauseCondition;
          setpauseProject(lastPauseCondition);
        }

        setHolddata(response?.data?.data?.pauseComments);
        setProjectManager(response?.data?.data?.projectManagerId?._id);
        setTester(response?.data?.data?.testerStatus || "-");
         setSubTasks(response?.data?.data?.subtasks || []);
      } else {
        console.log("Failed to fetch roles.");
      }
    } catch (error) {
      console.log("Failed to fetch roles.");
    }
  };
  useEffect(() => {
    fetchProjectall();
  }, []);

  // remove tagss

  function stripHtmlTags(str) {
    if (!str) return "";
    return str.replace(/<[^>]*>/g, "");
  }

  // download image to see

  const handleCommonFileDownload = (filePath) => {
    try {
      const imageUrl = `${API_URL}api/uploads/others/${filePath}`;
      window.open(imageUrl, "_blank");
    } catch (error) {
      toast.error("Failed to open image");
    }
  };

  const handleCommonFilecommon = (filePath) => {
    try {
      const imageUrl = `${API_URL}api/uploads/others/${filePath}`;
      window.open(imageUrl, "_blank");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // status changes

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const now = new Date().toISOString();
    let updatedStartTime = startTime;
    let updatedStopTime = stopTime;

    if (newStatus === "in-progress" && !startTime) {
      updatedStartTime = now;
      setStartTime(now);
    } else if (newStatus === "in-review" && !stopTime) {
      updatedStopTime = now;
      setStopTime(now);
    }

    const payload = {
      status: newStatus,
      startTime: updatedStartTime,
      endTime: updatedStopTime,
      updatedAt: now,
      updatedBy: employeeId,
    };

    // console.log("payload", payload);

    try {
      const response = await axios.patch(
        `${API_URL}api/task/updated-status/${taskId}`,
        payload
      );

      // console.log("Status updated:", response.data);

      toast.success("Task status updated successfully!");
      fetchProjectlogs();
    } catch (error) {
      console.log("error", error);
      console.error("Error updating status:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update task status.";

      toast.error(errorMessage);
      fetchProjectall();
      // toast.error(message);
    }
  };

  const [editorContent, setEditorContent] = useState("");
  // const fileUploadRef = useR/ef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileUploadRef = useRef(null);
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("comment", editorContent);
    formData.append("createdBy", employeeId);
    formData.append("taskId", taskId);
    uploadedFiles.forEach((file) => {
      formData.append("document[]", file);
    });

    try {
      const response = await axios.post(
        `${API_URL}api/task/task-comments`,
        formData
      );

      // console.log("Upload success:", response.data);
      // alert("Submitted successfully!");
      setEditorContent("");
      setUploadedFiles([]);
      fileUploadRef.current?.clear();
      fetchProject();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    }
  };
  const [message, setMessage] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/task/particular-task-comment/${taskId}`
      );
      // console.log(response);
      if (response.data.success) {
        setMessage(response.data.data);
      } else {
        console.log("Failed to fetch roles.");
      }
    } catch (err) {
      console.log("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const getTimeDifference = (startTime, stopTime) => {
    if (!startTime || !stopTime) return "";

    const start = new Date(startTime);
    const stop = new Date(stopTime);

    if (isNaN(start) || isNaN(stop)) return "Invalid time";

    let diff = stop - start;

    // Prevent negative values (e.g., if stop is before start)
    if (diff < 0) return "Stop before Start";

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

  //  const handleholdChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setpauseProject(selectedValue);

  //   // if (selectedValue === "hold") {
  //   //   setShowModal(true);
  //   // } else if (selectedValue === "restart") {
  //   //   // Immediately calcl API without modal
  //   //   setNote(""); // No note required for restart
  //   //   handleholdSubmit("restart");
  //   // }

  //   if (selectedValue === "hold") {
  //     setShowModal(true);
  //   } else if (selectedValue === "restart") {
  //     setNote("");
  //     setShowModal(false);
  //     // handleholdSubmit("restart");
  //   }
  // };

  const handleholdChange = (e) => {
    const selectedValue = e.target.value;
    setpauseProject(selectedValue);

    if (selectedValue === "hold") {
      setShowModal(true); // Show custom modal with textarea
    } else if (selectedValue === "restart") {
      setNote(""); // Clear note just in case
      // Show confirmation popup for restart
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setpauseProject("");
    setNote("");
  };

  // const handleholdSubmit = async () => {
  //   //  const status = statusOverride || pauseProject; statusOverride = null
  //   const payload = {
  //     pauseProject: pauseProject,
  //     note: note,
  //   };

  //   console.log("Submitted payload:", payload);

  //   try {
  //     const response = await axios.put(
  //       `${API_URL}api/task/task-pasusecondition/${taskId}`,
  //       payload
  //     );

  //     console.log("Status updated:", response.data);
  //      Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to restart this project?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Restart",
  //   })
  //     setShowModal(false);
  //     setNote("");
  //   } catch (error) {
  //     console.error("Update failed:", error);
  //     alert("Failed to update task status");
  //   }
  // };

  const [error, setError] = useState("");

  const handleholdSubmit = async () => {
    const actionText =
      pauseProject === "hold" ? "hold this project" : "restart this project";
    const confirmButtonText =
      pauseProject === "hold" ? "Yes, Hold" : "Yes, Restart";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
    });

    if (result.isConfirmed) {
      const payload = {
        pauseProject: pauseProject,
        note: note,
        updatedBy: employeeId,
      };

      // console.log("Submitted payload:", payload);

      try {
        const response = await axios.put(
          `${API_URL}api/task/task-pasusecondition/${taskId}`,
          payload
        );

        // console.log("Status updated:", response.data);

        toast.success(
          `Project ${
            pauseProject === "hold" ? "hold" : "restarted"
          } successfully.`
        );

        setShowModal(false);
        setNote("");
        fetchProjectall();
        fetchProjectlogs();
        setError("");
      } catch (error) {
        console.error("Update failed:", error);
        setError("Please add a note");
        toast.error("Failed to update task status.");
      }
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const [showPopuplogs, setShowPopuplogs] = useState(false);

  const handleClicklogs = () => {
    setShowPopuplogs(true);
  };

  const handleCloselogs = () => {
    setShowPopuplogs(false);
  };

  const exportToCSV = () => {
    const csvData = Papa.unparse(
      logs.map((item, index) => ({
        SNo: index + 1,
        Status: item.status,
        "Updated At": new Date(item.updatedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        "Updated By": item.updatedBy,
      }))
    );

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    // saveAs(blob, "logs.csv");
    saveAs(blob, `logs-${employeeemail}.csv`);
  };

  function formatHtml(html) {
    return DOMPurify.sanitize(html);
  }

  const [tester, setTester] = useState([]);

  const handleTesterChange = async (e) => {
    const value = e.target.value;
    setTester(value); // update the state

    const confirmText = value === "0" ? "Yet Not Started" : "Started";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to set tester status to '${confirmText}'?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${confirmText}`,
    });

    if (result.isConfirmed) {
      const payload = {
        taskId: taskId,
        testerStatus: value,
        updatedBy: employeeId,
      };

      try {
        const response = await axios.put(
          `${API_URL}api/task/updated-tester-status`,
          payload
        );
        // console.log(response);

        toast.success(`Tester status updated to '${confirmText}'`);

        setShowModal(false);
        fetchProjectlogs();
        fetchProjectall();
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update task status.");
      }
    }
  };

  const [logs, setLogs] = useState([]);
  // console.log("logs", logs);

  const fetchProjectlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}api/task/tasklogs/${taskId}`);
      // console.log(response.data)j;
      if (response.data.success) {
        setLogs(response.data.data);
      } else {
        console.log("Failed to fetch logs.");
      }
    } catch (err) {
      console.log("Failed to fetch logs.");
    }
  };

  useEffect(() => {
    fetchProjectlogs();
  }, []);

  const fileInputRef = useRef();

  const handleIconClick = () => {
    fileInputRef.current.click(); // programmatically trigger file input
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };



  // Handle adding a new task
  const handleAddTask = () => {
    try {
      const payload = {
        taskId: alldata._id,
        title: newTask,
        createdById: employeeId,
      };
      const response = axios.post(
        `${API_URL}api/subtasks/create-subtask`,
        payload
      );
      fetchProjectall();
    } catch (error) {
      console.log("error to add subtask");
    }
    setNewTask("");
    setIsAddingTask(false);
  };

  const handleSubTaskStatus = (id, value) => {
    try {
      const payload = {
        status: value,
        updatedBy: employeeId,
      };
      const response = axios.put(
        `${API_URL}api/subtasks/update-subtask/${id}`,
        payload
      );
      fetchProjectall();
       toast.success("SubTask status updated successfully");
    } catch (error) {
      console.log("error to update subtask status");
       toast.error(
        error?.response?.data?.message || "Failed to update subtask status."
      );
    }
  };

   const handleDeleteSubTask = (id) => {
    try {
     
      const response = axios.delete(
        `${API_URL}api/subtasks/delete-subtask/${id}`,
       
      );
      fetchProjectall();
      toast.success("SubTask deleted successfully");
      
    } catch (error) {
      console.log("error to delete subtask status");
       toast.error(
        error?.response?.data?.message || "Failed to delete subtask ."
      );
    }
  };
  const columns = [
    {
      field: "title",
      header: "Sub Task",
    },
    {
      field: "status",
      header: "priority",
      body: (rowData) => (
        <div className="flex items-center justify-center gap-1">
          <div
            className={`flex gap-1 px-2 rounded-sm justify-center items-center font-semibold capitalize ${
              rowData.priority === "high"
                ? "text-red-500 bg-red-100"
                : rowData.priority === "medium"
                ? "text-orange-400 bg-orange-100"
                : rowData.priority === "low"
                ? "text-yellow-300 bg-yellow-100"
                : "text-gray-500"
            }`}
          >
            <span className="font-normal">{rowData.priority}</span><PiFlagPennantFill />
          </div>

         
        </div>
      ),
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <div className="flex items-center justify-center gap-1">
          {/* Status Indicator */}
          {rowData?.status === "todo" ? (
            <span className="bg-blue-600 w-2 h-2 rounded-full"></span>
          ) : rowData?.status === "in-progress" ? (
            <span className="bg-orange-500 w-2 h-2 rounded-full"></span>
          ) : (
            <span className="bg-green-600 w-2 h-2 rounded-full"></span>
          )}

          {/* Select with options */}
          <select
            className="px-2 py-1 border rounded border-none cursor-pointer outline-none"
            value={rowData?.status} // Set the select value based on rowData.status
            onChange={(e) => handleSubTaskStatus(rowData._id, e.target.value)} // Handle status change
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      ),
    },
    //  {
    //   field: "action",
    //   header: "Action",
    //   body: (rowData) => (
    //    <> <button onClick={()=>handleDeleteSubTask(rowData._id)} className="text-xl text-red-500 hover:text-red-600 hover:scale-105 "><AiFillDelete /></button></>
    //   ),
    // },
  ];
//   if (employeeId === projectManager) {
//   columns.push({
//     field: "action",
//     header: "Action",
//     body: (rowData) => (
//       <button
//         onClick={() => handleDeleteSubTask(rowData._id)}
//         className="text-xl text-red-500 hover:text-red-600 hover:scale-105"
//       >
//         <AiFillDelete />
//       </button>
//     ),
//   });
// }

  return (
    <>
      {" "}
      <div className="h-full w-screen flex flex-col justify-between  bg-gray-100 ">
        <div className=" py-3 px-8 md:py-10 ">
          <Mobile_Sidebar />

          <ToastContainer />

          <div className="flex gap-2 items-center cursor-pointer">
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/tasklist")}
            >
              Task List
            </p>
            <p>{">"}</p>
            <p className="text-sm text-blue-500">Task View</p>
          </div>
          {/* task details */}
          <section className=" flex flex-wrap bg-white rounded-2xl">
            {/* right side */}
            <div className="w-full md:w-[64%] pt-5 md:pt-10 relative border-r-0 md:border-r-2 border-gray-400">
              <h2 className=" text-gray-600 text-[22px] px-5 md:px-10">Details</h2>
              <div className="h-[540px] overflow-y-scroll md:mr-2">
                {/* project title */}

                <div className="mt-8 px-5 md:px-10">
                  <span className="font-bold text-[16px]  text-gray-500  ">
                    Task Title :
                  </span>
                  <span className=" text-gray-500 text-[14px] md:mx-4">
                    {capitalizeFirstLetter(alldata.title)}
                  </span>
                </div>
                {/* project description */}

                <div className="mt-6 px-5 md:px-10 ">
                  <div className="items-start">
                    <span className="font-bold text-[16px]  text-gray-500 ">
                      Task Description:
                    </span>
                    <div
                      className=" text-gray-500 text-[14px] w-[90%] md:mx-4 mt-1"
                      dangerouslySetInnerHTML={{
                        __html: formatHtml(alldata.description),
                      }}
                    ></div>
                  </div>
                </div>

                {/* attachment */}
                {alldata.document && alldata.document.length > 0 && (
                  <div className="mt-1 flex gap-2 px-10 ">
                    <span className="font-bold text-[16px]  text-gray-500  ">
                      Attachment:
                    </span>
                    <span className=" text-gray-500 text-[14px]">
                      {alldata.document && Array.isArray(alldata.document) && (
                        <div className="flex gap-2 flex-wrap">
                          {alldata.document.map((doc, idx) => {
                            const extension = doc.filepath
                              ?.split(".")
                              .pop()
                              .toLowerCase();
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() =>
                                  handleCommonFileDownload(doc.filepath)
                                }
                              >
                                {getFileIcon(extension)}
                                
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </span>
                  </div>
                )}
                {/* comments */}

              
                 {/* subtask details */}
                <div className="mt-6 px-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[16px] text-gray-500 font-bold">
                      Sub task items
                    </span>
                    {employeeId === projectManager && (  <button
                      className="text-gray-500 hover:text-gray-600 hover:scale-105 border p-1 rounded-full  bg-slate-300"
                      onClick={() => setIsAddingTask(!isAddingTask)}
                    >
                      <FaPlus  />
                    </button>)}
                  
                  </div>

                 {/* DataTable */}
                 <div className="overflow-x-auto">
                  <DataTable
                    value={subTasks}
                    showGridlines
                    tableStyle={{ minWidth: "50rem" }}
                    resizableColumns
                    columnResizeMode="fit"
                    // scrollable
                    scrollHeight="200px"
                    className="border border-gray-300 max-h-[200px] rounded-md shadow-md"
                  >
                    {columns.map((col, index) => (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={
                          index === 0 // Target the first column (task description)
                            ? {
                                minWidth: "180px", // Ensure the column has a minimum width
                                maxWidth: "300px", // You can adjust this width based on your layout needs
                                wordWrap: "break-word", // Allow word wrapping within the cell
                                whiteSpace: "normal", // Ensure text wraps and doesn't stay in a single line
                                overflow: "visible", // Ensure content doesn't overflow
                              }
                            : {}
                        }
                      />
                    ))}
                  </DataTable>
                  </div>

                  {isAddingTask && (
                    <div className="mt-4 relative">
                      <InputText
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter task title"
                        className="p-inputtext-sm py-2 px-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div
                        onClick={handleAddTask}
                        className="right-0 top-0 absolute p-button-sm rounded-r-md p-button-success bg-blue-600 text-white text-xl font-bold flex justify-center items-center h-full px-2"
                      >
                        <HiOutlineArrowTurnUpLeft />
                      </div>
                    </div>
                  )}
                </div>
                  {/* message details*/}
                <div className="mt-1 md:pb-16">
                  <h2 className=" text-[16px]  text-gray-500 font-bold px-10">
                    Comments:{" "}
                  </h2>
                  <div className="mt-7 space-y-4 px-10 pb-10">
                    {message.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start space-x-2 w-[100%]"
                      >
                        <img
                          src={`${API_URL}api/uploads/${msg.photo}`}
                          alt={msg.name}
                          className="w-10 h-10 rounded-l-full shadow-md rounded-tr-full"
                        />

                        <div className="bg-gray-100/70 p-4 rounded-lg shadow-sm w-[600px] space-y-2">
                          <p className="text-sm font-semibold text-gray-800 capitalize">
                            {capitalizeFirstLetter(msg.name)}
                          </p>

                          <p
                            className="text-sm break-words text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: formatHtml(msg.comment),
                            }}
                            target="_blank"
                          >
                            {/* {capitalizeFirstLetter(stripHtmlTags(msg.comment))} */}
                          </p>

                          <div className="">
                            {msg.document && Array.isArray(msg.document) && (
                              <div className="flex gap-1 flex-wrap">
                                {msg.document.map((doc, idx) => {
                                  const extension = doc.filepath
                                    ?.split(".")
                                    .pop()
                                    .toLowerCase();
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1 cursor-pointer  p-2 hover:bg-gray-100"
                                      onClick={() =>
                                        handleCommonFilecommon(doc.filepath)
                                      }
                                    >
                                      {getFileIcon(extension)}
                                      {/* <span className="text-sm text-blue-600 underline">
                                        {doc.originalName}
                                      </span> */}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between text-xs text-gray-400 pt-1 border-t border-gray-400">
                            {/* <span>created by {msg.Email}</span> */}
                            <span></span>
                            <span>
                              {new Date(msg.createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 md:absolute md:bottom-0 w-[100%] bg-white p-1">
                <div className="card w-[100%]  mt-2">
                  <div className="flex justify-end items-center gap-1 p-2">
                    <p className="text-gray-700">
                      {uploadedFiles?.length > 0
                        ? `${uploadedFiles?.length} files`
                        : ""}{" "}
                    </p>
                    <div className="w-8 h-8   bg-gray-300/50 p-1 rounded-full text-2xl cursor-pointer hover:scale-105">
                      <FaUpload
                        onClick={handleIconClick}
                        className="text-gray-600 p-1 text-2xl cursor-pointer "
                      />

                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>{" "}
                    <button
                      className="bg-blue-600 ml-2 text-md px-4 py-1 hover:scale-105 duration-200 text-white  rounded-2xl"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    {/* attachment  files*/}
                    <div className="">
                      {/* <div className=" text-gray-800 text-[18px] font-bold ">
                  Attachment Files:
                </div> */}

                      {/* <FileUpload
                  name="demo[]"
                  ref={fileUploadRef}
                  multiple
                  accept="image/*"
                  auto
                  showUploadButton={false}
                  showCancelButton={true}
                  onSelect={(e) =>
                    setUploadedFiles((prev) => [...prev, ...e.files])
                  }
                  chooseLabel="Upload"
                  className="overflow-y-scroll h-10 w-[90%]"
                /> */}
                    </div>
                  </div>
                  <Editor
                    value={editorContent}
                    onTextChange={(e) => setEditorContent(e.htmlValue)}
                    style={{ height: "100px" }}
                    placeholder="Add a comment..."
                  />
                </div>
              </div>
            </div>

            {/* left side */}
            <div className="w-full md:w-[36%] pt-4 px-4 md:px-8 pb-10 bg-gray-100/20">
              {/* status */}
              <div className="max-w-md mx-auto  space-y-5">
                <div className="flex justify-end text-gray-500 text-lg">
                  #{alldata?.taskId}
                </div>
                <div className="flex justify-end">
                  <LuLogs
                    onClick={handleClicklogs}
                    className="cursor-pointer"
                    title="Logs"
                  />
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px] text-gray-500">
                    Project Name
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      value={alldata.projectId?.name}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Status
                  </div>

                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="todo">TO DO</option>

                    <option value="in-progress">IN PROGRESS</option>
                    <option value="in-review">IN REVIEW</option>
                    {employeeId === projectManager && (
                      <option value="done">DONE</option>
                    )}
                    <option value="block">BLOCKED</option>
                  </select>
                </div>

                {status === "in-review" && employeeId === projectManager && (
                  <div className="flex items-center space-x-4">
                    <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                      Tester
                    </div>

                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tester}
                      onChange={handleTesterChange}
                    >
                      {/* <option value="" disabled>
                        Select option
                      </option> */}
                      <option value="0">Yet Not Started</option>
                      <option value="1">Started</option>
                    </select>
                  </div>
                )}

                {/* Start Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Start Time
                  </div>
                  <input
                    type="text"
                    value={
                      startTime
                        ? new Date(startTime).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Stop Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    End Time
                  </div>
                  <input
                    type="text"
                    value={
                      stopTime
                        ? new Date(stopTime).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* end time */}

                {/* <div className="flex items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Worked Time
                  </div>
                  <input
                    type="text"
                    value={getTimeDifference(startTime, stopTime)}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div> */}

                {/* hold */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Pause
                  </div>

                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pauseProject}
                    onChange={handleholdChange}
                  >
                    <option value="" disabled selected={pauseProject === ""}>
                      Select option
                    </option>

                    <option
                      value="hold"
                      style={{
                        display:
                          pauseProject === "" || pauseProject === "restart"
                            ? "block"
                            : "none", // Show 'Hold' if empty or 'restart' is selected
                      }}
                    >
                      Hold
                    </option>

                    <option
                      value="restart"
                      style={{
                        display: pauseProject === "hold" ? "block" : "none", // Show 'Restart' if empty or 'hold' is selected
                      }}
                    >
                      Restart
                    </option>
                  </select>
                </div>

                {/* <div className="flex justify-end">
                  <FaEye
                    onClick={handleClick}
                    className="cursor-pointer"
                    title="View "
                  />
                </div> */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Assigned To
                  </div>
                  <div className="w-full py-2 text-gray-700 text-[14px]">
                    {alldata.assignedTo?.employeeName}
                  </div>
                </div>
                {/* created by */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Created By
                  </div>
                  <div className="w-full py-2 text-gray-700 text-[14px]">
                    {alldata.createdById?.employeeName || "Admin"}
                  </div>
                </div>

                {/* reporter */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Reporter By
                  </div>
                  <div className="w-full py-2 text-gray-700 text-[14px]">
                    {alldata.projectManagerId?.projectManagerName}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Priority
                  </div>
                  <div className="w-full py-2 text-gray-700">
                    <div
                      className={` px-3  rounded-md inline-block
                         ${
                           alldata.priority === "high"
                             ? "text-[#c8212f] bg-[#ffebee] "
                             : alldata.priority === "medium"
                             ? "text-[#e65200] bg-[#ffa60142]"
                             : alldata.priority === "low"
                             ? "text-[#a0881e] bg-[#ffea0059]"
                             : "text-gray-700 bg-gray-100"
                         }`}
                    >
                      {capitalizeFirstLetter(alldata.priority)}
                    </div>
                  </div>
                </div>

                {/* Task Created Date and Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4 mt-4">
                  <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                    Created Date and Time
                  </div>
                  <div className="w-full py-2 text-gray-700">
                    {new Date(alldata.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* hold notes */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-[500px] rounded-xl shadow-xl p-6">
                <div className="mb-2">
                  <h2 className="text-lg font-bold  text-gray-800">
                    Add Note <span className="text-red-600">*</span>
                  </h2>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <textarea
                  rows="4"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded mb-4"
                  placeholder="Add a note..."
                ></textarea>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleholdSubmit()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* hold view table */}

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
              onClick={handleClose}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Details</h2>
                  <button
                    className="text-gray-500 hover:text-red-500 text-2xl"
                    onClick={handleClose}
                  >
                    &times;
                  </button>
                </div>

                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">S.No</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holddata?.length > 0 ? (
                      holddata.map((item, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="p-2 border text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold ${
                                item.pauseCondition === "hold"
                                  ? "text-red-600"
                                  : item.pauseCondition === "restart"
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {capitalizeFirstLetter(item.pauseCondition)}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            {item.time
                              ? new Date(item.time).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : ""}
                          </td>
                          <td className="p-2 border">
                            {capitalizeFirstLetter(item.note)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* all logs */}

          {showPopuplogs && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
              onClick={handleCloselogs}
            >
              <div className="bg-white p-6 h-[500px] overflow-y-scroll rounded-xl shadow-lg max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Details</h2>
                  <div className="flex flex-col justify-end"></div>
                  <button
                    className="text-gray-500 hover:text-red-500 text-2xl"
                    onClick={handleCloselogs}
                  >
                    &times;
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={exportToCSV}
                    className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
                  >
                    <FaFileExport />
                  </button>
                </div>

                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">S.No</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Notes</th>

                      <th className="p-2 border">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs?.length > 0 ? (
                      logs.map((item, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="p-2 border text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold ${
                                item.status === "hold"
                                  ? "text-red-600"
                                  : item.status === "restart"
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {capitalizeFirstLetter(
                                item.status.replace(/[^a-zA-Z0-9 ]/g, " ")
                              )}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )
                              : ""}
                          </td>
                          <td className="p-2 border">
                            {capitalizeFirstLetter(item.note || "-")}
                          </td>
                          <td className="p-2 border capitalize">
                            {item.updatedBy.employeeName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Task_view_all;
