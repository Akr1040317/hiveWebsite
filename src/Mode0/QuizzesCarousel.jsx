// QuizzesCarousel.jsx

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronRight, FaLock } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "../SubscriptionModal";
import "./Carousel.css"; // Custom CSS for carousel styling

const QuizzesCarousel = ({ userRole }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage

  // Normalize userRole to lowercase for consistent comparison
  const normalizedUserRole = userRole ? userRole.toLowerCase() : "";

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesCollection = collection(db, "Quiz");
        const quizzesSnapshot = await getDocs(quizzesCollection);
        const quizzesList = await Promise.all(
          quizzesSnapshot.docs.map(async (doc) => {
            const quizData = doc.data();
            let imageURL = quizData.imageURL || quizData.image; // Handle both 'imageURL' and 'image'

            // Check if imageURL is a Storage path or a full URL
            if (imageURL && !imageURL.startsWith("http")) {
              // Assume it's a Storage path, fetch the download URL
              try {
                const imageRef = ref(storage, imageURL);
                imageURL = await getDownloadURL(imageRef);
              } catch (error) {
                console.error(
                  `Error fetching download URL for quiz ${doc.id}:`,
                  error
                );
                imageURL = "/placeholder.png"; // Fallback image
              }
            }

            // Normalize userGroups to lowercase
            const normalizedUserGroups = quizData.userGroups
              ? quizData.userGroups.map((group) => group.toLowerCase())
              : [];

            return {
              id: doc.id,
              ...quizData,
              imageURL,
              userGroups: normalizedUserGroups, // Store normalized userGroups
            };
          })
        );

        setQuizzes(quizzesList);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchQuizzes();
  }, [db, storage]);

  const handleQuizClick = (quiz) => {
    const isAllowed =
      quiz.userGroups && quiz.userGroups.includes(normalizedUserRole);

    if (isAllowed) {
      navigate(`/quizzes/${quiz.id}`); // Navigate to quiz detail
    } else {
      setSelectedQuiz(quiz);
      setIsModalOpen(true);
    }
  };

  // Sort quizzes: unlocked first, then locked
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const aAllowed =
      a.userGroups && a.userGroups.includes(normalizedUserRole);
    const bAllowed =
      b.userGroups && b.userGroups.includes(normalizedUserRole);

    if (aAllowed && !bAllowed) return -1;
    if (!aAllowed && bAllowed) return 1;
    return 0;
  });

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Adjust based on your design
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      {/* Carousel Header */}
      <div className="carousel-header flex justify-between items-center px-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Quizzes</h2>
        <button
          className="text-[#ffa500] flex items-center hover:underline"
          onClick={() => navigate("/quizzes")}
        >
          More <FaChevronRight className="ml-2" />
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div> {/* Implemented loader in CSS */}
        </div>
      ) : (
        /* Carousel Slider */
        <Slider {...settings}>
          {sortedQuizzes.map((quiz) => {
            const isAllowed =
              quiz.userGroups &&
              quiz.userGroups.includes(normalizedUserRole);

            // Debugging: Log the access status of each quiz
            console.log(
              `Quiz: ${quiz.quizName || quiz.id}, Allowed: ${isAllowed}`
            );

            return (
              <div key={quiz.id} className="carousel-card">
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleQuizClick(quiz)}
                >
                  {/* Quiz Image */}
                  <img
                    src={quiz.imageURL}
                    alt={quiz.quizName || quiz.id}
                    className="w-full h-64 object-cover rounded-lg" // Increased height to h-64 (256px)
                    loading="lazy" // Enables lazy loading
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png"; // Fallback image
                    }}
                  />

                  {/* Black Overlay for Locked Quizzes */}
                  {!isAllowed && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                  )}

                  {/* Top-Right Lock Icon for Locked Quizzes */}
                  {!isAllowed && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full">
                      <FaLock className="text-white text-lg" />
                    </div>
                  )}

                  {/* Bottom-Right Overlay with Quizzes Count */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    <span>{quiz.numberOfWords} Words</span>
                  </div>
                </div>

                {/* Quiz Title */}
                <h3 className="text-white mt-2 text-lg font-semibold text-center">
                  {quiz.quizName || quiz.id}
                </h3>
              </div>
            );
          })}
        </Slider>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default QuizzesCarousel;
