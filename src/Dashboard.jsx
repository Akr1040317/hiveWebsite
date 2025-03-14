// Dashboard.jsx

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase imports
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore imports
import {
  FaBars,
  FaAngleLeft,
  FaHome,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUsers,
  FaChartLine,
  FaHive,
  FaBug,
  FaComment,
  FaTools,
  FaBook,
  FaChartBar,
  FaTrophy,
  FaUser,
  FaInfoCircle,
} from "react-icons/fa"; // Import additional icons
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./Dashboard.css";
import QuizManagement from "./QuizManagement";
import LessonManagement from "./LessonManagement";
// Import other components as needed
import Mode0 from "./Mode0"; // Import the new Mode0 component
import Lessons from "./Lessons";
import Quizzes from './Quizzes';
import Hive from './Hive';
import Tools from './Tools';

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [username, setUsername] = useState(""); // Store the username here
  const [currentUser, setCurrentUser] = useState(null); // To store user data from Firestore
  const [activeView, setActiveView] = useState("dashboard"); // State to handle view switching
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const [userTier, setUserTier] = useState(null); // State to track user tier
  const navigate = useNavigate(); // Initialize navigate

  const toggleSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen);
  };

  const handleSignOut = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log("Signed out successfully");
        setUsername("Guest");
        navigate("/"); // Redirect to the main page
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  // Fetch user data from Firestore and determine role and tier
  const fetchUser = async (uid) => {
    const db = getFirestore();
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setCurrentUser(userData); // Store current user data
      setUsername(userData.username); // Set the username
      setIsAdmin(userData.role === "admin"); // Check if the user is an admin
      if (userData.role !== "admin") {
        setUserTier(userData.tier); // Set the user tier if not admin
      }
    } else {
      console.log("No such user found");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(user.uid); // User is signed in, fetch their data
      } else {
        navigate("/"); // Redirect to login if not signed in
      }
    });

    return () => unsubscribe();
  }, [navigate]); // Adding navigate as a dependency to ensure the redirect works

  return (
    <>
      {/* Page Container */}
      <div
        id="page-container"
        className={`mx-auto flex min-h-screen w-full min-w-[320px] flex-col bg-[#191919] text-gray-100 ${
          desktopSidebarOpen ? "lg:pl-64" : ""
        }`}
      >
        {/* Sidebar */}
        <nav
          id="page-sidebar"
          aria-label="Main Sidebar Navigation"
          className={`fixed bottom-0 left-0 top-0 z-50 flex h-full w-full flex-col bg-[#202020] transition-transform duration-500 ease-out lg:w-64 ${
            desktopSidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
          } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-16 w-full flex-none items-center justify-between bg-[#202020] px-4 lg:justify-center">
            {/* Brand */}
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-100"
            >
              <img src="/IconResized.png" alt="Gathr Logo" className="gathr-logo" />
              <span>Hive - Spell Intelligently</span>
            </a>
          </div>

          {/* Sidebar Navigation */}
          <div className="overflow-y-auto flex-1">
            <div className="w-full p-4">
              <nav className="space-y-1">
                {/* Common Home Option */}
                <a
                  href="#"
                  className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-white ${
                    activeView === "dashboard"
                      ? "bg-[#303030]"
                      : "hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                  }`}
                  onClick={() => setActiveView("dashboard")}
                >
                  <FaHome className="icon" />
                  <span className="grow py-2">Home</span>
                </a>

                {/* Admin Only Options */}
                {isAdmin ? (
                  <>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "quizManagement"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("quizManagement")}
                    >
                      <FaChalkboardTeacher className="icon" />
                      <span className="grow py-2">Quiz Management</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "lessonManagement"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("lessonManagement")}
                    >
                      <FaBookOpen className="icon" />
                      <span className="grow py-2">Lesson Management</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "hive"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("hive")}
                    >
                      <FaHive className="icon" />
                      <span className="grow py-2">The Hive</span>
                    </a>
                    <a
                      href="#"
                      className="group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                    >
                      <FaUsers className="icon" />
                      <span className="grow py-2">Classroom</span>
                    </a>
                    <a
                      href="#"
                      className="group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                    >
                      <FaChartLine className="icon" />
                      <span className="grow py-2">Analytics</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "tools"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("tools")}
                    >
                      <FaHive className="icon" />
                      <span className="grow py-2">Tools</span>
                    </a>
                    
                  </>
                ) : (
                  // Non-Admin Users with Tiers
                  <>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "lessons"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("lessons")}
                    >
                      <FaBook className="icon" />
                      <span className="grow py-2">Lessons</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "quizzes"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("quizzes")}
                    >
                      <FaChalkboardTeacher className="icon" />
                      <span className="grow py-2">Quizzes</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "hive"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("hive")}
                    >
                      
                      <FaChartBar className="icon" />
                      <span className="grow py-2">Progress</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "leaderboard"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("leaderboard")}
                    >
                      <FaTrophy className="icon" />
                      <span className="grow py-2">Leaderboard</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "profile"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("profile")}
                    >
                      <FaUser className="icon" />
                      <span className="grow py-2">Profile</span>
                    </a>
                    <a
                      href="#"
                      className={`group flex items-center gap-2 rounded-lg px-2.5 text-sm font-medium ${
                        activeView === "about"
                          ? "bg-[#303030] text-white"
                          : "text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_10px_#ffa500]"
                      }`}
                      onClick={() => setActiveView("about")}
                    >
                      <FaInfoCircle className="icon" />
                      <span className="grow py-2">About</span>
                    </a>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Feedback, Bug Report, and Sign Out buttons at the bottom */}
          <div className="mt-auto p-4">
            <button
              className="w-full flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_5px_#ffa500]"
              onClick={() => console.log("Feedback Clicked")}
            >
              <FaComment className="w-5 h-5" />
              Send Feedback
            </button>

            <button
              className="w-full mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#ffa500]/10 hover:shadow-[0_0_5px_#ffa500]"
              onClick={() => console.log("Report Bug Clicked")}
            >
              <FaBug className="w-5 h-5" />
              Report a Bug
            </button>

            <button
              className="w-full mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </nav>

        {/* Page Header */}
        <header
          id="page-header"
          className={`fixed left-0 right-0 top-0 z-30 flex h-16 flex-none items-center bg-[#191919] shadow-sm ${
            desktopSidebarOpen ? "lg:pl-64" : ""
          }`}
        >
          <div className="mx-auto flex w-full max-w-10xl justify-between px-4 lg:px-8">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-[#191919] px-3 py-2 text-sm font-semibold text-gray-100 hover:shadow-[0_0_10px_#ffa500]"
            >
              {desktopSidebarOpen ? <FaAngleLeft /> : <FaBars />}
            </button>
            <h1>Hive Dashboard</h1>
            <span className="text-gray-100 font-semibold">{username}</span>
          </div>
        </header>

        {/* Main Content */}
        <div id="page-content" className="flex max-w-full flex-auto flex-col pt-16">
          <div className="mx-auto w-full max-w-10xl p-4 lg:p-8">
            {/* Conditionally Render Content */}
            {activeView === "dashboard" ? (
              <Mode0
                username={username}
                points={currentUser?.pointsWeekly || 0}
                profilePictureURL={currentUser?.profilePictureURL}
                userRole={currentUser?.role || "userTier0"}
              />
            ) : isAdmin && activeView === "quizManagement" ? (
              <QuizManagement /> // Render Quiz Management
            ) : isAdmin && activeView === "lessonManagement" ? (
              <LessonManagement /> // Render Lesson Management
            ) : isAdmin && activeView === "hive" ? (
              <Hive /> // Render Hive Management
            ) : isAdmin && activeView === "tools" ? (
              <Tools /> // Render Tools Page
            ) : !isAdmin && activeView === "lessons" ? (
              <Lessons /> // Render Lessons Page
            ) : !isAdmin && activeView === "quizzes" ? (
              <Quizzes /> // Render Quizzes Page
            ) : !isAdmin && activeView === "hive" ? (
              <Hive /> // Render Hive Page for non-admin
            ) : !isAdmin && activeView === "progress" ? (
              <Progress /> // Render Progress Page
            ) : !isAdmin && activeView === "leaderboard" ? (
              <Leaderboard /> // Render Leaderboard Page
            ) : !isAdmin && activeView === "profile" ? (
              <Profile /> // Render Profile Page
            ) : !isAdmin && activeView === "about" ? (
              <About /> // Render About Page
            ) : (
              <Mode0
                username={username}
                points={currentUser?.pointsWeekly || 0}
                profilePictureURL={currentUser?.profilePictureURL}
                userRole={currentUser?.role || "userTier1"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
