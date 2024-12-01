import honeyDrop from "./assets/honeyDrop.png";
import React from "react";
import LessonsCarousel from "./Mode0/LessonsCarousel";
import QuizzesCarousel from "./Mode0/QuizzesCarousel";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Mode0.css"; // Custom CSS for Mode0

const Mode0 = ({ username, points, userRole }) => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="mode0-container flex flex-col gap-4">
      {/* Header Bar */}
      <div className="mode0-header flex items-center bg-[#004afd] p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white">Hi, {username} 👋</h2>
        <div className="flex-grow"></div> {/* Spacer to push points to the right */}
        <div className="points-container flex items-center px-3 py-1 rounded-lg">
          <img src={honeyDrop} alt="Points" className="w-12 h-12 mr-2" />
          <span className="text-lg font-semibold text-white">{points} Points</span>
        </div>
      </div>

      {/* Carousels */}
      <div className="mode0-carousels flex flex-col gap-0">
        <LessonsCarousel userRole={userRole} />
        <QuizzesCarousel userRole={userRole} />
      </div>
    </div>
  );
};

export default Mode0;
