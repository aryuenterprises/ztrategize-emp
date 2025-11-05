import React from "react";
import Sidebar from "../components/Sidebar";
import Attendance_Mainbar from "../components/attendancecomponents/Attendance_Mainbar";

const Attendance = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Attendance_Mainbar/>
    </div>
  );
};

export default Attendance;
