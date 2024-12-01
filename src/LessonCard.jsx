// LessonCard.jsx

import React from 'react';
import { FaLock } from 'react-icons/fa';
import './LessonCard.css'; // Import the CSS for LessonCard

export default function LessonCard({
  imageURL,
  title,
  lessonsCount,
  totalTime,
  isLocked,
  onClick,
}) {
  return (
    <div className="lesson-card" onClick={onClick}>
      <div className="image-container">
        <img src={imageURL} alt={title} className="lesson-card-image" />
        {isLocked && (
          <div className="lesson-card-lock-overlay">
            <FaLock className="lock-icon" />
          </div>
        )}
      </div>
      <div className="lesson-card-title">
        {title}
      </div>
    </div>
  );
}
