import React from "react";
import Sidebar from "../components/Sidebar";
import MyProfile_mainbar from "../components/my profile components/MyProfile_mainbar";

const MyProfile = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <MyProfile_mainbar />
    </div>
  );
};

export default MyProfile;
