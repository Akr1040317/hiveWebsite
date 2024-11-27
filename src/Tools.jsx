// src/components/Tools/Tools.jsx
import React, { useState } from 'react';
import {
  FaToolbox,
  FaChartBar,
  FaCog,
  FaHeart,
  FaInfoCircle,
  FaQuestionCircle,
  FaSearch,
  FaUser,
} from 'react-icons/fa';

// Import Tool Components
import WordManagement from "./WordManagement.jsx";

const Tools = () => {
  // State to track the selected tool
  const [selectedTool, setSelectedTool] = useState(null);

  // List of tools with their names and icons
  const toolsList = [
    { id: 1, name: 'Word Management', icon: <FaChartBar /> },
    { id: 2, name: 'Section Management', icon: <FaUser /> },
    { id: 3, name: 'Onboarding Control', icon: <FaCog /> },
    { id: 4, name: 'Feedback Center', icon: <FaHeart /> },
    { id: 5, name: 'Notification Center', icon: <FaInfoCircle /> },
    { id: 6, name: 'Help & Support', icon: <FaQuestionCircle /> },
    { id: 7, name: 'Search', icon: <FaSearch /> },
    { id: 8, name: 'Profile', icon: <FaToolbox /> },
  ];

  // Function to render the selected tool component
  const renderTool = () => {
    switch (selectedTool) {
      case 1:
        return <WordManagement />;
      case 2:
        return <SectionManagement />;
      case 3:
        return <OnboardingControl />;
      case 4:
        return <FeedbackCenter />;
      case 5:
        return <NotificationCenter />;
      case 6:
        return <HelpSupport />;
      case 7:
        return <SearchTool />;
      case 8:
        return <ProfileTool />;
      default:
        return (
          <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">Welcome to Tools</h2>
            <p className="text-gray-300">
              Select a tool from the left to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section - Scrollable List */}
      <div className="left-section w-1/3 overflow-y-auto h-full p-4 bg-[#1a1a1a]">
        {/* Tool Buttons */}
        {toolsList.map((tool) => (
          <div
            key={tool.id}
            className={`bg-[#202020] p-6 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer flex items-center ${
              selectedTool === tool.id
                ? 'brightness-150'
                : 'brightness-100 hover:brightness-125'
            }`}
            style={{ transition: '0.3s ease' }}
            onClick={() => setSelectedTool(tool.id)}
          >
            <div className="text-white text-2xl mr-6">{tool.icon}</div>
            <h2 className="text-xl text-white font-bold">{tool.name}</h2>
          </div>
        ))}
      </div>

      {/* Right Section - Tool Content */}
      <div className="right-section w-2/3 p-4 rounded-lg ml-4 h-full overflow-y-auto bg-[#1a1a1a]">
        {renderTool()}
      </div>
    </div>
  );
};

export default Tools;
