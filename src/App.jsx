import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Login = lazy(() => import("./pages/Login"));
const Leaves = lazy(() => import("./pages/Leaves"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
import { useState } from "react";
import ProtectedRoute from "./components/protectedRoute";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import WorkFromHome from "./pages/WorkFromHome";
import axios from "axios";
import { API_URL } from "./components/config";
import TaskList from "./pages/TaskListPage";
import TaskListPage from "./pages/TaskListPage";
import Task_view_all from "./components/TaskList/Task_view_all";
import Tasklist_main from "./components/TaskList/Tasklist_main";
import MonthlyAttendanceDetails from "./components/attendancecomponents/MonthlyAttendanceDetails";
import Policy_main from "./pages/Policy_main";
import EmployeeDetails from "./components/dashboard components/EmployeeDetails";
import Reports_mainbar from "./pages/Reports_mainbar";
import Request from "./pages/Request";
import Bidding_main from "./pages/Bidding_main";
import Bidding from "./pages/Bidding";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check local storage during initial render
    const userDetails = localStorage.getItem("hrms_employee");
    return userDetails ? true : false;
  });

  useEffect(() => {
    const handleStorageChange = async () => {
      const userDetails = localStorage.getItem("hrms_employee");
      setIsLoggedIn(userDetails ? true : false);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkIfEmployeeIsDeleted = async () => {
      const userDetails = JSON.parse(localStorage.getItem("hrms_employee")); // parse it!

      if (!userDetails?.email) return;

      const payload = {
        email: userDetails.email,
      };

      try {
        const response = await axios.post(
          `${API_URL}api/employees/isdelete-employee`,
          payload
        );

        if (!response.data.success) {
          localStorage.removeItem("hrms_employee");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error checking delete status:", error);
      }
    };

    checkIfEmployeeIsDeleted();
  }, []);

  useEffect(() => {
    const lastLogoutDate = localStorage.getItem("lastLogoutDate");
    const today = new Date().toDateString(); // e.g., "Tue Aug 06 2025"

    if (lastLogoutDate !== today) {
      localStorage.removeItem("hrms_employee");
      localStorage.setItem("lastLogoutDate", today);

      window.location.href = "/";
    }
  }, []);

  const bidding = JSON.parse(localStorage.getItem("hrms_employee"));
  const role = bidding?.role?.name;
  // console.log("rolec",role)

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> */}

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dummy"
          element={<ProtectedRoute isLoggedIn={isLoggedIn}></ProtectedRoute>}
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Leaves />
            </ProtectedRoute> 
          }
        />
        <Route
          path="/wfh"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WorkFromHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasklist"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policy"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Policy_main />
            </ProtectedRoute>
          }
        />

        {role === "Online Bidder" &&      
        <>
        <Route
          path="/bidding-assets"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Bidding_main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bidding"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Bidding />
            </ProtectedRoute>
          }
        /></>}
        <Route
          path="/employeedetails"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Reports_mainbar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthlyattendancedetails"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MonthlyAttendanceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasklist-details/:taskId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Tasklist_main />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myprofile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Request />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/message" element={<Message />} /> */}
        <Route path="*" element={<PageNotFound />} />
        <Route path="sitemap" element={<Sitemap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
