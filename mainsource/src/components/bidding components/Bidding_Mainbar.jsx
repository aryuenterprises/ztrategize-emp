import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";

import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import axios from "axios";
import { API_URL } from "../config";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";

const Bidding_Mainbar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [biddingList, setBiddingList] = useState([]);
  // Fetch roles from the API
  useEffect(() => {
    fetchBiddingList();
  }, []);

  const [accountBidderOptions, setAccountBidderOptions] = useState(null);
  const [technologyBidderOptions, setTechnologyBidderOptions] = useState(null);

  const [date, setDate] = useState("");
  const [accName, setAccName] = useState("");
  const [clientName, setClientName] = useState("");
  const [technology, setTechnology] = useState("");
  const [reply, setReply] = useState("");
  const [link, setLink] = useState("");
  const [biddingStatus, setBiddingStatus] = useState("");
  const [noOfConnections, setNoOfConnections] = useState("");
  const [noOfboots, setNoOfboots] = useState("");
  const [status, setStatus] = useState("");

  const [errors, setErrors] = useState({});

  const [employeeTypeIsOpen, setEmployeeTypeIsOpen] = useState(false);
  const [selectedEmployeeTypeId, setSelectedEmployeeTypeId] = useState(null);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchBiddingList = async () => {
    try {
      const employeeDetails = JSON.parse(localStorage.getItem("hrms_employee"));
      const employeeId = employeeDetails._id;
      const response = await axios.get(
        `${API_URL}api/bidder/view-employee-bidder-id/${employeeId}`
      );
      console.log(response);

      if (response.data.success) {
        const sortedData = response.data.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date); // Descending order
        });

        setBiddingList(sortedData);
      } else {
        setErrors("Failed to fetch biddingList.");
      }
    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };

  const fetchAccTechList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/bidder/view-account-technology-bidder`
      );

      const accountBidderOptions = response.data.data?.accountBidder?.map(
        (data) => ({
          label: data.name,
          value: data._id,
        })
      );
      const technologyBidderOptions = response.data.data?.technologyBidder?.map(
        (data) => ({
          label: data.name,
          value: data._id,
        })
      );

      setTechnologyBidderOptions(technologyBidderOptions);
      setAccountBidderOptions(accountBidderOptions);
    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
    setErrors({});
  };

  const [biddingDetails, setBiddingDetails] = useState({
    _id: "",
    date: "",
    account: "",
    client: "",
    employeeId: "",
    link: "",
    reply: "",
    status: "",
    technology: "",
     noOfConnections: "",
     noOfboots:"",
  });

  console.log("test", biddingDetails);

  const openEditModal = (row) => {
    console.log(row);

    setBiddingDetails({
      id: row._id,
      date: row.date,
      account: row.account._id,
      client: row.client,
      employeeId: row.employeeId,
      link: row.link,
      reply: row.reply,
      status: row.status,
      noOfConnections: row.noOfConnections,
      technology: row.technology._id,
      noOfboots:row.noOfBoost,

    });
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors({});
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const employeeDetails = JSON.parse(localStorage.getItem("hrms_employee"));
    const employeeId = employeeDetails._id;
    try {
      const formdata = {
        employeeId: employeeId,
        date: date,
        account: accName,
        client: clientName,
        technology: technology,
        reply: reply,
        link: link,
        noOfConnections: Number(noOfConnections),
        noOfBoost: Number(noOfboots),
        createdBy: employeeId,
      };

      const response = await axios.post(
        `${API_URL}api/bidder/create-employee-bidder`,
        formdata
      );
      setIsAddModalOpen(false);
      fetchBiddingList();
      setErrors({});
      setAccName("");
      setStatus("");
      toast.success("Bidding Details Added Successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors); // Set validation errors from API
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  const handleSave = async (roleId) => {
    const {
      date,
      account,
      client,
      employeeId,
      link,
      reply,
      status,
      technology,
      noOfConnections,
    } = biddingDetails;
    console.log(roleId);
    // if (biddingDetails.name.length <= 0) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     name: ["Role name is required"],
    //   }));
    //   return;
    // }

    try {
      // Assuming you're sending a PUT request to update the role
      await axios.put(`${API_URL}api/bidder/edit-employee-bidder/${roleId}`, {
        date,
        account,
        client,
        employeeId,
        link,
        reply,
        status,
        technology,
        noOfConnections: noOfConnections,
        // created_by: userid,
      });

      setBiddingDetails({
        date: "",
        account: "",
        client: "",
        employeeId: "",
        link: "",
        reply: "",
        status: "",
        technology: "",
      });

      // Close the modal after successful update
      setIsEditModalOpen(false);
      fetchBiddingList(); // Refresh the table after adding a role
      setErrors({});
      toast.success("Role name updated successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors); // Set validation errors from API
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  // Validate Role Name dynamically
  const validateAccName = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.name = ["Acc name is required"];
    } else {
      delete newErrors.name;
    }
    setErrors(newErrors);
  };

  // Validate Status dynamically
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };

  const rolesWithSno = biddingList.map((bid, index) => ({
    ...bid,
    Sno: index + 1, // Add Sno field
  }));

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Status ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}api/bidder/delete-employee-bidder/${id}`
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        fetchBiddingList();
        console.log("res", res);
        // setAccountdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Status.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Status is safe :)", "info");
    }
  };

  const columns = [
    { field: "date", header: "Date" },
    {
      field: "account.name",
      header: "Account Name",
      body: (row) => row.account?.name || "-",
    },
    {
      field: "technology.name",
      header: "Technology",
      body: (row) => row.technology?.name || "-",
    },
    { field: "status", header: "Status" },
    {
      field: "action",
      header: "Action",
      body: (row) => {
        return (
          <>
          <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div
                  className="modula-icon-edit flex gap-2"
                  style={{
                    color: "#000",
                  }}
                ></div>
            <button onClick={() => openEditModal(row)} className="cursor-pointer">
              <TfiPencilAlt />
            </button>
            {/* <button onClick={() => handleDelete(row._id)}>
              <MdOutlineDeleteOutline />
            </button> */}
            {/* <button onClick={}>Dlt</button> */}
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    // Fetch Employee Types
    fetchAccTechList();
    fetch(`${API_URL}api/bidder/view-employee-bidder`)
      .then((res) => res.json())
      .then((data) => setEmployeeTypeOptions(data.data));
  }, []);

  let navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
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
          <p className="text-sm text-blue-500">Bidding</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8">
          <div>
            <h1 className="text-3xl font-semibold">Bidding Details</h1>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="datatable-container">
          <div className="table-scroll-container" id="datatable">
            <DataTable
              className="mt-8"
              value={biddingList}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
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
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div className="absolute inset-0" onClick={closeAddModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">
                  Add Bidding Details
                </p>
                <form onSubmit={handlesubmit}>
                  <div className="mt-10 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-md font-medium mb-2"
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      {errors.date && (
                        <p className="w-[300px] text-red-500 text-sm mb-4 mt-1">
                          {errors.date}
                        </p>
                      )}
                    </div>
                    <div className="relative w-[300px]">
                      <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="acc"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Account Name <span className="text-red-500">*</span>
                      </label>
                      {errors.account && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.account}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <Dropdown
                        value={accName}
                        onChange={(e) => setAccName(e.value)}
                        options={accountBidderOptions}
                        optionLabel="label"
                        appendTo="self"
                        placeholder="Select an Account"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Client"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      {errors.client && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.client}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="Client"
                        name="Client"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value);
                          validateAccName(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Technology"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Technology <span className="text-red-500">*</span>
                      </label>
                      {errors.technology && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.technology}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <Dropdown
                        value={technology}
                        onChange={(e) => setTechnology(e.value)}
                        options={technologyBidderOptions}
                        optionLabel="label"
                        appendTo="self"
                        placeholder="Select a Technology"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="reply"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Client Reply <span className="text-red-500">*</span>
                      </label>
                      {errors.reply && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.reply}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px] flex gap-6">
                      <div className="flex gap-2">
                        <input
                          onChange={() => setReply("yes")}
                          type="radio"
                          id="yes"
                          name="reply"
                          checked={reply === "yes"}
                        />
                        <label htmlFor="yes">Yes</label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          onChange={() => setReply("no")}
                          type="radio"
                          id="no"
                          name="reply"
                          checked={reply === "no"}
                        />
                        <label htmlFor="no">No</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="connections"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        No.Of Connects{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.noOfConnections && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.noOfConnections}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="number"
                        id="connections"
                        onChange={(e) => setNoOfConnections(e.target.value)}
                        name="connections"
                        value={noOfConnections}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                          <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Boots"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        No.Of Boosts{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.noOfConnections && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.noOfConnections}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="number"
                        id="Boots"
                        onChange={(e) => setNoOfboots(e.target.value)}
                        name="connections"
                        value={noOfboots}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="link"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Link <span className="text-red-500">*</span>
                      </label>
                      {errors.link && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.link}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="link"
                        onChange={(e) => setLink(e.target.value)}
                        name="text"
                        value={link}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="bidding"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Bidding
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="bidding"
                        name="bidding"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div> */}

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Status
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <select
                        name="status"
                        id="status"
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          validateStatus(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-14">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div className="absolute inset-0" onClick={closeEditModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">
                  Edit Bidding Details
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(biddingDetails.id);
                  }}
                >
                  <div className="mt-10 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-md font-medium mb-2"
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      {errors.date && (
                        <p className="w-[300px] text-red-500 text-sm mb-4 mt-1">
                          {errors.date}
                        </p>
                      )}
                    </div>
                    <div className="relative w-[300px]">
                      <input
                        id="date"
                        type="date"
                        value={biddingDetails.date}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="acc"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Account Name <span className="text-red-500">*</span>
                      </label>
                      {errors.account && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.account}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <Dropdown
                        value={biddingDetails.account}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            account: e.value,
                          })
                        }
                        options={accountBidderOptions}
                        optionLabel="label"
                        appendTo="self"
                        placeholder="Select an Account"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Client"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      {errors.client && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.client}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="Client"
                        name="Client"
                        value={biddingDetails.client}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            client: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Technology"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Technology <span className="text-red-500">*</span>
                      </label>
                      {errors.technology && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.technology}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <Dropdown
                        value={biddingDetails.technology}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            technology: e.value,
                          })
                        }
                        options={technologyBidderOptions}
                        optionLabel="label"
                        appendTo="self"
                        placeholder="Select a Technology"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="reply"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Reply <span className="text-red-500">*</span>
                      </label>
                      {errors.reply && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.reply}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px] flex gap-6">
                      <div className="flex gap-2">
                        <input
                          onChange={() =>
                            setBiddingDetails({
                              ...biddingDetails,
                              reply: "yes",
                            })
                          }
                          type="radio"
                          id="yes-edit"
                          name="reply"
                          checked={biddingDetails.reply === "yes"}
                        />
                        <label htmlFor="yes-edit">Yes</label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          onChange={() =>
                            setBiddingDetails({
                              ...biddingDetails,
                              reply: "no",
                            })
                          }
                          type="radio"
                          id="no-edit"
                          name="reply"
                          checked={biddingDetails.reply === "no"}
                        />
                        <label htmlFor="no-edit">No</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="connections"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        No.Of Connects{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.noOfConnections && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.noOfConnections}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="number"
                        id="connections"
                        onChange={(e) =>
                            setBiddingDetails({
                              ...biddingDetails,
                              noOfConnections: e.target.value,
                            })
                          }
                        name="connections"
                        value={biddingDetails?.noOfConnections}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                              <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="Boots"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        No.Of Boosts{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.noOfConnections && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.noOfConnections}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="number"
                        id="Boots"
                         onChange={(e) =>
                            setBiddingDetails({
                              ...biddingDetails,
                              noOfboots: e.target.value,
                            })
                          }
                        name="connections"
                        value={biddingDetails.noOfboots}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="link"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Link <span className="text-red-500">*</span>
                      </label>
                      {errors.link && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.link}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="link"
                        name="link"
                        value={biddingDetails.link}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            link: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="bidding"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Bidding
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="bidding"
                        name="bidding"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div> */}

                  <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Status
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <select
                        name="status"
                        id="status"
                        value={biddingDetails.status}
                        onChange={(e) =>
                          setBiddingDetails({
                            ...biddingDetails,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-14">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default Bidding_Mainbar;
