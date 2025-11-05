import React from "react";
import Sidebar from "../components/Sidebar";
import Dashboard_Mainbar from "../components/dashboard components/Dashboard_Mainbar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <Dashboard_Mainbar />
    </div>
  );
};

export default Dashboard;
