// LessonsCarousel.jsx

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronRight, FaLock } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "../SubscriptionModal";
import CategoryPopup from "./CategoryPopup"; // Import the CategoryPopup component
import "./Carousel.css"; // Custom CSS for carousel styling

import Lessons from "../Lessons"; // Adjust path based on your file structure

const LessonsCarousel = ({ userRole }) => {
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage

  // Define allowed categories based on userRole
  const getAllowedCategories = (role) => {
    const baseCategories = [
      "Greek Lessons",
      "Latin Lessons",
      "English Lessons",
      "Speller's Toolbox",
    ];

    if (role.toLowerCase() === "admin") {
      return []; // All categories are allowed for admin
    } else {
      return baseCategories; // Default for userTier1 and others
    }
  };

  const allowedCategories = getAllowedCategories(userRole);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = await Promise.all(
          categoriesSnapshot.docs.map(async (doc) => {
            const categoryData = doc.data();
            let imageURL = categoryData.imageURL;

            // Check if imageURL is a Storage path or a full URL
            if (imageURL && !imageURL.startsWith("http")) {
              // Assume it's a Storage path, fetch the download URL
              try {
                const imageRef = ref(storage, imageURL);
                imageURL = await getDownloadURL(imageRef);
              } catch (error) {
                console.error(
                  `Error fetching download URL for category ${doc.id}:`,
                  error
                );
                imageURL = "/placeholder.png"; // Fallback image
              }
            }

            return {
              id: doc.id,
              ...categoryData,
              imageURL,
            };
          })
        );

        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [db, storage]);

  // Define the handleCategoryClick function
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  // Sort categories: unlocked first, then locked
  const sortedCategories =
    allowedCategories.length === 0
      ? categories // Admin: all unlocked
      : [
          ...categories.filter((cat) =>
            allowedCategories.includes(cat.categoryId)
          ),
          ...categories.filter(
            (cat) => !allowedCategories.includes(cat.categoryId)
          ),
        ];

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
        <h2 className="text-2xl font-bold text-white">Lessons</h2>
        <button
          className="text-[#ffa500] flex items-center hover:underline"
          onClick={() => navigate(Lessons)}
        >
          More <FaChevronRight className="ml-2" />
        </button>
      </div>

      {/* Carousel Slider */}
      <Slider {...settings}>
        {sortedCategories.map((category) => {
          const categoryId = category.categoryId || category.id;
          if (!categoryId) {
            console.warn(`Category ${category.id} is missing categoryId.`);
            return null; // Skip rendering this category
          }

          const isAllowed =
            allowedCategories.length === 0
              ? true
              : allowedCategories.includes(categoryId);

          return (
            <div key={category.id} className="carousel-card">
              <div
                className="relative cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category Image */}
                <img
                  src={category.imageURL}
                  alt={category.categoryId || category.id}
                  className="w-full h-64 object-cover rounded-lg" // Increased height to h-64 (256px)
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png"; // Fallback image
                  }}
                />

                {/* Black Overlay for Locked Categories */}
                {!isAllowed && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                )}

                {/* Top-Right Lock Icon for Locked Categories */}
                {!isAllowed && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full">
                    <FaLock className="text-white text-lg" />
                  </div>
                )}

                {/* Bottom-Right Overlay with Lessons Count and Time */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  <span>
                    {category.lessons ? category.lessons.length : 0} Lessons •{" "}
                    {category.time || "0m"}
                  </span>
                </div>
              </div>

              {/* Category Title */}
              <h3 className="text-white mt-2 text-lg font-semibold text-center">
                {category.categoryId || category.id}
              </h3>
            </div>
          );
        })}
      </Slider>

      {/* Category Popup */}
      <CategoryPopup
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </div>
  );
};

export default LessonsCarousel;
