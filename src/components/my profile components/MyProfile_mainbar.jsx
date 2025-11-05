import { useState, useEffect } from "react";
import Footer from "../Footer";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFileWord } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa";
import Mobile_Sidebar from "../Mobile_Sidebar";
import axios from "axios";
import { API_URL } from "../config";
import Loader from '../Loader'

const MyProfile_mainbar = () => {
  const [employee, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("hrms_employee"));
    const token = localStorage.getItem("hrms_employee_token");
    fetchData(user.id, token);
  }, []);

  const openDocument = (url) => {
    window.open(url, "_blank");
  };

  const [employeeDocuments, setEmployeeDocuments] = useState([]);

  const fetchData = async (employee_id, token) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/view/${employee_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);

      const employeeDocuments = response.data.data?.employee_details?.documents;

      const updatedEmployeeDocuments = employeeDocuments.map((category) => {
        return {
          document_name: category.title,
          documents: category.file.map((doc) => {
            return {
              name: doc.original_name,
              url: doc.file,
              id: doc.id,
            };
          }),
        };
      });

      setEmployeeDocuments(updatedEmployeeDocuments);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  // console.log(employee);

  return (
    <div className="flex  flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10 ">
      <Mobile_Sidebar />

      {/* breadcrumb */}
      <div className="flex gap-2  text-sm items-center">
        <p className=" text-gray-500 cursor-pointer ">My Profile</p>
        <p>{">"}</p>
      </div>

      {isLoading ? (
        <Loader/>
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
                          src={`${API_URL}/${employee?.employee_details?.profile_image}`}
                          alt="Employee Profile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col  gap-3">
                    <p className="font-semibold text-2xl">
                      {
                        employee?.employee_details?.employee_name
                      }
                    </p>

                    {employee?.names?.length > 1 && (
                      <p className="bg-orange-300 text-sm md:text-base font-medium px-2 text-center py-1 rounded-full">
                        {employee?.names
                          ?.map((role) => capitalizeFirstLetter(role))
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start flex-wrap gap-5 mt-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE ID</p>
                    <p className="font-semibold">
                      {employee?.employee_details?.employeeid}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DEPARTMENT</p>
                    <p className="font-semibold">
                      {employee?.employee_details?.department}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DATE OF JOINING</p>
                    <p className="font-semibold">
                      {/* {employee?.employee_details?.date_of_joining} */}
                      {employee?.employee_details?.date_of_joining
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE TYPE</p>
                    <p className="font-semibold">
                      {employee?.employee_details?.employee_type}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-gray-200 mt-5 px-8 rounded-2xl py-3">
                  <div className="flex flex-wrap gap-3 md:gap-8">
                    <p className="font-medium">
                      {employee?.employee_details?.email_address}
                    </p>
                    <p className="font-medium">
                      {employee?.employee_details?.phone_number}
                    </p>
                  </div>

                  <hr className="w-full border-gray-300" />
                  <p className="mt-2 font-extrabold text-green-500">
                    {employee.employee_details?.status === "1"
                      ? "On Duty"
                      : "Reliving"}
                  </p>
                  {employee.employee_details?.status === "0" &&
                    employee.employee_details?.reliving_date && (
                      <p className="mt-1 text-sm text-gray-500">
                        Reliving Date:{" "}
                        {employee?.employee_details?.reliving_date}
                      </p>
                    )}
                </div>
              </div>
              <div className="border-2 bg-white flex-grow rounded-2xl  px-5 md:px-7 py-5">
                {/* <div className="flex justify-between"> */}
                <p className="text-2xl font-semibold">Personal Info</p>
               
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Passport No</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.personal_info?.passport_no ??
                        "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Pan No</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.bank_information?.pan_no}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Aadhar No</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.personal_info?.aadhar_no}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Birthday</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.personal_info?.date_of_birth
                        .split("-")
                        .reverse()
                        .join("-") ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Marital Status</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.personal_info
                        ?.marital_status ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-3 ">
              {/* <div className="flex justify-between"> */}
              <p className="text-2xl font-semibold">Skills</p>
             
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(employee?.employee_details?.skills) ? (
                  employee.employee_details.skills.map((item, index) => (
                    <p
                      key={item.id}
                      className="px-3 py-1 text-sm rounded-full border-2 w-fit"
                    >
                      {item.skills}
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
                  <p className="text-2xl font-semibold mb-5">Educations</p>
                 
                  {employee?.employee_details?.education_info ? (
                    employee?.employee_details?.education_info.map(
                      (item, index) => (
                        <div className="flex gap-2 flex-col">
                           <div className="flex gap-2 justify-between flex-wrap items-center ">
                            <p className="text-sm ">Institute Name</p>
                            <p className="text-sm font-medium ">
                              {item.school_name ?? "N/A"}
                            </p>
                          </div>

                          <div className="flex gap-2 justify-between flex-wrap items-center ">
                            <p className="text-sm ">Department Name</p>
                            <p className="font-medium text-sm">
                              {item.department_name ?? "N/A"}
                            </p>
                          </div>

                         

                          <div className="flex gap-2 justify-between flex-wrap items-center ">
                            <p className="text-sm ">End Year</p>
                            <p className="text-sm font-medium ">
                              Graduated {item.period_of_end ?? "N/A"}
                            </p>
                          </div>

                          <hr className="my-3" />
                        </div>
                      )
                    )
                  ) : (
                    <p>N/A</p>
                  )}

                  
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  <p className="text-2xl font-semibold">Emergency Contact</p>
                 

                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Full Name</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.emergency_fullname}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Contact</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.emergency_contact}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm">Relation Type</p>
                    <p className="font-medium text-sm">
                      {employee?.employee_details?.emergency_relationtype}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-grow gap-3">
                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-0 md:mt-3">
                  <p className="text-2xl font-semibold">PF Info</p>
                  
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">UAN No</p>
                    <p className="text-sm font-medium">
                      {employee?.employee_details?.pf_info?.uan_number ?? "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between mt-3">
                    <p className="text-sm">PF join Date.</p>
                    
                    <p className="text-sm font-medium">
                      {employee?.employee_details?.pf_info?.pf_joining_date
                        ? employee.employee_details.pf_info.pf_joining_date
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm">PF Exp Date.</p>
                    <p className="text-sm font-medium">
                      {employee?.employee_details?.pf_info?.pf_exp_date
                        ? employee?.employee_details?.pf_info?.pf_exp_date
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A"}
                    </p>
                  </div>

                  {/* 
                <div className="flex justify-between mt-3">
                  <p className="text-sm">Phone Number</p>
                  <p className="text-sm font-medium">(380)-322-4422</p>
                </div> */}
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  {/* <div className="flex justify-between"> */}
                  <p className="text-2xl font-semibold">Documents</p>
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

                  <div className="">
                    {employeeDocuments.map((item) => (
                      <div className="mt-3" key={item.document_name}>
                        <p className="">{item.document_name}</p>
                        <div className="ms-5 flex items-center gap-2 flex-wrap">
                          {item.documents.map((document, index) => (
                            <div
                              key={index}
                              className="flex gap-1 bg-gray-100 px-4 py-4 hover:bg-gray-200 rounded-xl items-center text-3xl cursor-pointer"
                              onClick={() => openDocument(document.url)}
                            >
                              {document.name.includes(".pdf") && <FaFilePdf />}
                              {document.name.includes(".JPG") && (
                                <FaFileImage />
                              )}
                              {document.name.includes(".jpg") && (
                                <FaFileImage />
                              )}
                              {document.name.includes(".jpeg") && (
                                <FaFileImage />
                              )}
                              {document.name.includes(".png") && (
                                <FaFileImage />
                              )}
                              {document.name.includes(".xlsx") && (
                                <PiMicrosoftExcelLogoFill />
                              )}
                              {document.name.includes(".docx") && (
                                <FaFileWord />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* rightsidebar */}
          <div className="flex flex-col gap-3 basis-[30%]">
            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-2xl font-semibold">Bank information</p>
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
                <p className="text-sm">Bank account No.</p>
                <p className="font-medium text-sm">
                  {
                    employee?.employee_details?.bank_information
                      ?.bank_account_no
                  }
                </p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm">Bank Name</p>
                <p className="font-medium text-sm">
                  {employee?.employee_details?.bank_information?.bank_name}
                </p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm">Bank Branch</p>
                <p className="font-medium text-sm">
                  {employee?.employee_details?.bank_information?.bank_branch}
                </p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm">IFSC Code</p>
                <p className="font-medium text-sm">
                  {employee?.employee_details?.bank_information?.ifsc_code}
                </p>
              </div>
              <hr className="my-3" />
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-2xl font-semibold">Salary information</p>
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
              <p className="font-medium text-sm">
                {employee?.employee_details?.salary_information?.salary_basic}
              </p>
            </div> */}
              {/* <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm">Salary amount per month</p>
                <p className="font-medium text-sm">
                  {
                    employee?.employee_details?.salary_information
                      ?.salary_amount
                  }
                </p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className="font-medium text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm">Payment type</p>
                <p className="font-medium text-sm">
                  {employee?.employee_details?.salary_information?.payment_type}
                </p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className="font-medium text-sm">20%</p>
            </div> */}
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              <p className="text-2xl font-semibold">Experience</p>

              {employee?.employee_details?.experiences ? (
                employee?.employee_details?.experiences.map((item, index) => (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex justify-between flex-wrap items-center ">
                      <h1 className="text-sm ">Job Title</h1>

                      <p className="text-sm font-medium ">{item.job_tile}</p>
                    </div>

                    <div className="flex  justify-between flex-wrap items-center ">
                      <p className="text-sm ">Start & End Date</p>
                      <p className="text-sm font-medium ">
                        {item.period_of_work_start} - {item.period_of_work_end}
                      </p>
                    </div>

                    <div className="flex justify-between flex-wrap items-center ">
                      <h1 className="text-sm ">Company Industry</h1>
                      <p className="text-sm font-medium ">
                        {item.company_industry}
                      </p>
                    </div>

                    <div className="flex justify-between flex-wrap items-center ">
                      <h1 className="text-sm ">Company Name</h1>
                      <p className="text-sm font-medium ">
                        {item.company_name}
                      </p>
                    </div>

                    <div className="flex justify-between flex-wrap items-center ">
                      <h1 className="text-sm ">Responsibilities</h1>
                      <p className="text-sm font-medium ">
                        {item.responsibilities}
                      </p>
                    </div>

                    <div className="flex justify-between flex-wrap items-center ">
                      <h1 className="text-sm ">Previous Salary</h1>
                      <p className="text-sm font-medium">
                        {item.previous_salary}
                      </p>
                    </div>

                    <hr className="my-3" />
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoading && <Footer />}
    </div>
  );
};

export default MyProfile_mainbar;

// export default EmployeeDetails_Mainbar;
