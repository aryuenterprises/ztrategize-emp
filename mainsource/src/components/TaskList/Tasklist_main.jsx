import React from "react";
import Sidebar from "../Sidebar";
import Task_view_all from "./Task_view_all";

const Tasklist_main = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Task_view_all />
    </div>
  );
};

export default Tasklist_main;