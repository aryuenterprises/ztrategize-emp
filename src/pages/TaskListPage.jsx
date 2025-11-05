import React from "react";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList/TaskList.jsx";

const TaskListPage = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <TaskList />
    </div>
  );
};

export default TaskListPage;
