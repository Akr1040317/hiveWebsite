import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./CategoryPopup.css";

// Set the app element for react-modal
Modal.setAppElement("#root");

const CategoryPopup = ({ isOpen, onClose, category }) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    if (isOpen && category) {
      fetchAndFormatLessons();
    }
  }, [isOpen, category]);

  const fetchAndFormatLessons = async () => {
    setIsLoading(true);
    try {
      const fetchedLessons = await Promise.all(
        category.lessons.map(async (lessonId, index) => {
          const lessonDoc = await getDoc(doc(db, "lessons", lessonId));
          const lessonData = lessonDoc.exists() ? lessonDoc.data() : null;
          const title = lessonData?.title || lessonId;
          const formattedTitle = title.split(":")[0]; // Format title before ":"
          return { id: index, title: formattedTitle, lessonId };
        })
      );
      setLessons(fetchedLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="category-popup"
      overlayClassName="category-popup-overlay"
      contentLabel="Category Details"
    >
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="popup-title">{category?.categoryId}</h2>
        <img
          src={category?.imageURL}
          alt={category?.categoryId}
          className="popup-image"
        />
        <p className="popup-description">{category?.description}</p>

        {isLoading ? (
          <p>Loading lessons...</p>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson) => (
              <div key={lesson.lessonId} className="lesson-row">
                <span className="lesson-number">{lesson.id + 1}</span>
                <span className="lesson-title">{lesson.title}</span>
                <button
                  className="lesson-btn primary-btn"
                  onClick={() => handleLessonClick(lesson.lessonId)}
                >
                  View Lesson
                </button>
                <button
                  className="lesson-btn secondary-btn"
                  onClick={() => handleLessonClick(lesson.lessonId)}
                >
                  Take Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CategoryPopup;
