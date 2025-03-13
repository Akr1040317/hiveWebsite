import honeyDrop from "./assets/honeyDrop.png";
import React from "react";
import Tier0Carousel from "./Mode0/Tier0Carousel"; // New file
import { useNavigate } from "react-router-dom";
import "./Mode0.css"; // Your header/container styling

const Mode0 = ({ username, points, userRole }) => {
  const navigate = useNavigate();

  return (
    <div className="mode0-container flex flex-col gap-4">
      {/* Header Bar */}
      <div className="mode0-header flex items-center bg-[#004afd] p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white">Hi, {username} 👋</h2>
        <div className="flex-grow"></div>
        <div className="points-container flex items-center px-3 py-1 rounded-lg">
          <img src={honeyDrop} alt="Points" className="w-12 h-12 mr-2" />
          <span className="text-lg font-semibold text-white">{points} Points</span>
        </div>
      </div>

      {/* New Tier0 Carousel */}
      <Tier0Carousel userRole={userRole} />
    </div>
  );
};

export default Mode0;
