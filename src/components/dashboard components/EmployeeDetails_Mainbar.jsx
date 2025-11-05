import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config.js";
import axios from "../../api/axios.js";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFileWord } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { capitalizeFirstLetter } from "../StringCaps.js";
import Loader from "../Loader.jsx";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const EmployeeDetails_Mainbar = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = location.state || {};
    // console.log("employeeId",employeeId)
  const [employee, setData] = useState([]);

  console.log("employee", employee);

  const [employeeDocuments, setEmployeeDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [relievingDate, setRelievingDate] = useState("");
  // console.log("relievingDate", relievingDate);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  const handlpopup = () => {
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        expectedRelivingDate: relievingDate,
        relivingReason: reason,
      };

      const response = await axios.put(
        `${API_URL}api/employees/update-employee/${employeeId}`,
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
      fetchData();
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}api/employees/view-employee/${employeeId}`
      );
      setData(response.data.data);
      setRelievingDate(response.data.data.relivingDate);
      setReason(response.data.data.relivingReason);

      // console.log(response)

      const employeeDocuments = response.data?.data?.document;

      const updatedEmployeeDocuments = employeeDocuments?.map((category) => {
        return {
          document_name: category.title,
          documents: category.files.map((doc) => {
            return {
              name: doc.originalName,
              url: doc.filepath,
              // id: doc.id,
            };
          }),
        };
      });

      setEmployeeDocuments(updatedEmployeeDocuments);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // console.log(employee)
  const openDocument = (fileName) => {
    const url = `${API_URL}api/uploads/documents/${fileName}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 px-3 md:px-5 py-2 md:py-10">
      <Mobile_Sidebar />

      {/* breadcrumb */}
      <div className="flex gap-2  text-sm items-center">
        <p
          className="text-sm text-gray-500"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </p>
        <p>{">"}</p>
        <p className=" text-blue-500 ">Employee Details</p>
      </div>
      <ToastContainer />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col xl:flex-row md:gap-3 mt-3">
          {/* leftsidebar */}
          <div className="basis-[70%] pb-3 md:pb-0">
            <div className="flex flex-col lg:flex-row flex-grow gap-3">
              <div className="border-2 flex-grow rounded-2xl bg-white  px-5 md:px-7 py-5">
                <div className="flex gap-3">
                  <div>
                    <div className="flex">
                      <div className=" border-2  rounded-full h-16 w-16">
                        <img
                          className="rounded-full h-16 w-16"
                          src={`${API_URL}api/uploads/${employee?.photo}`}
                          alt="Employee Profile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col  gap-3">
                    <p className="font-semibold text-2xl">
                      {capitalizeFirstLetter(employee?.employeeName)}
                    </p>

                    {employee?.role && (
                      <p className="bg-orange-300 text-sm md:text-base  px-2 text-center py-1 rounded-full">
                        {capitalizeFirstLetter(employee.role.name)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start flex-wrap gap-5 mt-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE ID</p>
                    <p className="font-semibold">{employee?.employeeId}</p>
                  </div>
                  {/* 
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DEPARTMENT</p>
                    <p className="font-semibold">
                      {employee?.department}
                    </p>
                  </div> */}

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DATE OF JOINING</p>
                    <p className="font-semibold">
                      {/* {employee?.employee_details?.date_of_joining} */}
                      {new Date(employee?.dateOfJoining)
                        .toLocaleDateString("en-IN")
                        .replaceAll("/", "-")}
                      {/* {employee?.dateOfJoining} */}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE TYPE</p>
                    <p className="font-semibold">{employee?.employeeType}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-gray-200 mt-5 px-8 rounded-2xl py-3">
                  <div className="flex flex-wrap gap-3 md:gap-8">
                    <p className="">{employee?.email}</p>
                    <p className="">{employee?.phoneNumber}</p>
                  </div>

                  <hr className="w-full border-gray-300" />
                  <p
                    className={`mt-2 text-md  ${
                      employee.dutyStatus === "1"
                        ? "text-green-500"
                        : "text-orange-600"
                    }`}
                  >
                    {employee.dutyStatus === "1" ? "On Duty" : "Relieved "}
                    <span className="ml-10 ">
                      {employee?.dutyStatus === "1"
                        ? ""
                        : employee?.relivingDate?.split("T")[0]}
                    </span>
                  </p>
                  {employee.employee_details?.status === "0" &&
                    employee.employee_details?.reliving_date && (
                      <p className="mt-1 text-sm text-gray-500">
                        Reliving Date: {employee?.reliving_date}
                      </p>
                    )}
                </div>
              </div>
              <div className="border-2 bg-white flex-grow rounded-2xl  px-5 md:px-7 py-5">
                {/* <div className="flex justify-between"> */}
                <p className="text-[18px] font-semibold">Personal Info 1</p>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Passport No</p>
                    <p className="text-sm ms-3">
                      {employee?.passportNo ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm font-[400] text-gray-900">Pan No</p>
                    <p className=" text-sm">{employee?.panNo}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Aadhar No</p>
                    <p className=" text-sm">{employee?.aadharNo}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Birthday</p>
                    <p className=" text-sm">
                      {employee?.dateOfBirth
                        ? new Date(employee?.dateOfBirth)
                            .toLocaleDateString("en-IN")
                            .replaceAll("/", "-")
                        : ""}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Marital Status</p>
                    <p className=" text-sm">
                      {employee?.maritalStatus ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-3 ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Skills</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(employee?.skills) ? (
                  employee.skills.map((item, index) => (
                    <p
                      key={item.id}
                      className="px-3 py-1 text-sm rounded-full border-2 w-fit"
                    >
                      {item}
                    </p>
                  ))
                ) : (
                  <p>No skills available</p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-col flex-grow gap-3">
                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-3 ">
                  {/* <div className="flex justify-between"> */}
                  <p className="text-[18px] font-semibold mb-5">Educations</p>

                  {employee?.education ? (
                    employee?.education.map((item, index) => (
                      <div className="flex gap-2 flex-col">
                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">Institute Name</p>
                          <p className="text-sm  ">
                            {item.schoolName ?? "N/A"}
                          </p>
                        </div>

                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">Department Name</p>
                          <p className=" text-sm">
                            {item.departmentName ?? "N/A"}
                          </p>
                        </div>

                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">End Year</p>
                          <p className="text-sm  ">
                            Graduated {item.endYear ?? "N/A"}
                          </p>
                        </div>

                        <hr className="my-3" />
                      </div>
                    ))
                  ) : (
                    <p>N/A</p>
                  )}
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  <p className="text-[18px] font-semibold">Emergency Contact</p>

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Full Name</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.fullName}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Contact</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.contact}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Relation Type</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.relation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-grow gap-3">
                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-0 md:mt-3">
                  <p className="text-[18px] font-semibold">PF Info</p>

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">UAN No</p>
                    <p className="text-sm ">{employee?.uanNo ?? "N/A"}</p>
                  </div>
                  <hr className="my-3" />
                  {/* <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF join Date.</p>
                    
                    <p className="text-sm ">
                      {employee?.employee_details?.pf_info?.pf_joining_date
                        ? employee.employee_details.pf_info.pf_joining_date
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" /> */}

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF Join Date.</p>
                    <p className="text-sm ">
                      {employee?.pfJoinDate
                        ? new Date(employee.pfJoinDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF Exp Date.</p>
                    <p className="text-sm ">
                      {employee?.pfExpDate
                        ? new Date(employee.pfExpDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </p>
                  </div>

                  {/* 
                <div className="flex justify-between mt-3">
                  <p className="text-sm">Phone Number</p>
                  <p className="text-sm ">(380)-322-4422</p>
                </div> */}
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  {/* <div className="flex justify-between"> */}
                  <p className="text-[18px] font-semibold">Documents</p>
                  {/* <button
                    onClick={() =>
                      navigate("/editemployeedetails", {
                        state: {
                          employee_id: employee.employee_details.id,
                          scrollTo: "documents",
                        },
                      })
                    }
                    className="text-sm h-fit bg-gray-200 px-5 py-2 rounded-3xl"
                  >
                    Edit
                  </button>
                </div> */}

                  <div className="grid grid-cols-2">
                    {employeeDocuments?.map((item) => (
                      <div className="mt-3" key={item.document_name}>
                        <p className="">{item.document_name}</p>
                        <div className=" gap-2 mt-1">
                          {item.documents.map((document, index) => (
                            <div
                              key={index}
                              className="w-fit mt-1 px-4 gap-1 bg-gray-100 flex items-center py-1 hover:bg-gray-200 rounded-xl  text-xl cursor-pointer"
                              onClick={() => openDocument(document.url)}
                            >
                              {document.url.includes(".pdf") && <FaFilePdf />}
                              {document.url.includes(".JPG") && <FaFileImage />}
                              {document.url.includes(".jpg") && <FaFileImage />}
                              {document.url.includes(".jpeg") && (
                                <FaFileImage />
                              )}
                              {document.url.includes(".webp") && (
                                <FaFileImage />
                              )}
                              {document.url.includes(".png") && <FaFileImage />}
                              {document.url.includes(".xlsx") && (
                                <PiMicrosoftExcelLogoFill />
                              )}
                              {document.url.includes(".docx") && <FaFileWord />}

                              <span className="text-[14px]">
                                {document?.url.split("-")[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {employee.driveLink ? (
                  <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                    <p className="text-[18px] font-semibold mb-2 ">
                      Documents Drive Link
                    </p>
                    <a
                      href={employee.driveLink}
                      className="text-blue-700 flex items-center gap-2"
                      target="_blank"
                    >
                      <IoIosLink />
                      {employee.driveLink}
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* rightsidebar */}
          <div className="flex flex-col gap-3 basis-[30%]">
            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl">
              <p className="text-[18px] font-semibold">Personal Info 2</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between mt-3">
                  <p className="text-sm ">Father Name</p>
                  <p className=" text-sm">{employee?.fatherName ?? "N/A"}</p>
                </div>
                <hr />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between mt-3">
                  <p className="text-sm ">Mother Name</p>
                  <p className=" text-sm">{employee?.motherName ?? "N/A"}</p>
                </div>
                <hr />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-4 mt-3">
                  <p className="text-sm  ">
                    Address 1{" "}
                    <span className="text-xs md:text-sm pl-4">
                      {employee?.address1 ?? "N/A"}
                    </span>
                  </p>
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-4 mt-3">
                  <p className="text-sm  ">
                    Address 2{" "}
                    <span className="text-xs md:text-sm pl-4">
                      {employee?.address2 ?? "N/A"}
                    </span>
                  </p>
                </div>
                <hr />
              </div>
            </div>
            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Bank information</p>
              {/* <button
                onClick={() =>
                  navigate("/editemployeedetails", {
                    state: {
                      employee_id: employee.employee_details.id, // Pass the employee ID here
                      scrollTo: "bank-information",
                    },
                  })
                }
                className="text-sm bg-gray-200 h-fit px-5 py-2 rounded-3xl"
              >
                Edit
              </button>
            </div> */}
              <div className="flex justify-between mt-3">
                <p className="text-sm ">Bank account No.</p>
                <p className=" text-sm">{employee?.bank?.accountNo}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm ">GPay / PhonePe Number</p>
                <p className=" text-sm">{employee?.bank?.gpayNumber}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">Bank Name</p>
                <p className=" text-sm">{employee?.bank?.bankName}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">Bank Branch</p>
                <p className=" text-sm">{employee?.bank?.branch}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">IFSC Code</p>
                <p className=" text-sm">{employee?.bank?.ifscCode}</p>
              </div>
              <hr className="my-3" />
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Salary information</p>
              {/* <button
                onClick={() =>
                  navigate("/editemployeedetails", {
                    state: {
                      employee_id: employee.employee_details.id, // Pass the employee ID here
                      scrollTo: "salary-information",
                    },
                  })
                }
                className="text-sm bg-gray-200 px-5 py-2 rounded-3xl"
              >
                Edit
              </button>
            </div> */}
              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Salary basis </p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.salary_basic}
              </p>
            </div> */}
              {/* <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Salary amount per month</p>
                <p className=" text-sm">{employee?.salaryAmount}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Payment type</p>
                <p className=" text-sm">{employee?.paymentType}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className=" text-sm">20%</p>
            </div> */}
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              <p className="text-[18px] font-semibold">Experience</p>

              {employee?.experience ? (
                employee?.experience.map((item, index) => (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Job Title</h1>

                      <p className="text-sm  ">{item.jobTitle}</p>
                    </div>

                    <div className="grid grid-cols-2  ">
                      <p className="text-sm ">Start & End Date</p>
                      <p className="text-sm  ">
                        {item.startWork} - {item.endWork}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Company Industry</h1>
                      <p className="text-sm  ">{item.companyIndustry}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Company Name</h1>
                      <p className="text-sm  ">{item.companyName}</p>
                    </div>

                    <div className="grid grid-cols-2  ">
                      <h1 className="text-sm ">Responsibilities</h1>
                      <p className="text-sm  ">{item.responsibilities}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Previous Salary</h1>
                      <p className="text-sm ">{item.previousSalary}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">selected Documents</h1>

                      <ul className="flex flex-wrap gap-x-6 mx-3 list-disc">
                        {item.selectedDocs.map((data) => (
                          <li className="text-sm  ">{data}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="my-3" />
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
            </div>

            {/* exit form */}

            <div
              className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl 
          "
            >
              {/* <div className="flex justify-between"> */}
              <div className="flex justify-between">
                {" "}
                <p className="text-[18px] font-semibold">Reliving</p>
                <div className="cursor-pointer" onClick={handlpopup}>
                  <FaEdit />
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Reliving Date</p>
                <p className=" text-sm">
                  {/* {employee?.relivingDate || "-"} */}

                  {employee?.relivingDate
                    ? new Date(employee.relivingDate).toLocaleDateString(
                        "en-GB"
                      )
                    : "-"}
                </p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3 gap-2 flex-wrap">
                <p className="text-sm ">Reliving Reason </p>
                <p className=" text-sm">{employee?.relivingReason || "-"}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className=" text-sm">20%</p>
            </div> */}
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[400px] p-6">
            <h2 className="text-xl font-semibold mb-4">
              Expected Employee Relieving
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Relieving Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Relieving Date
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={
                    relievingDate
                      ? new Date(relievingDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => setRelievingDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reason */}
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

              {/* Buttons */}
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
      )}

      {/* Edit Modal */}
    </div>
  );
};

export default EmployeeDetails_Mainbar;
