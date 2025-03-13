import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { FaLock, FaPlayCircle } from "react-icons/fa";
import "./Carousel.css";

const Tier0Carousel = ({ userRole }) => {
  const navigate = useNavigate();
  const db = getFirestore();

  // Define item references (mirroring your SwiftUI example)
  const itemRefs = [
    { id: "1", docID: "intro", itemType: "article" },
    {
      id: "2",
      docID: "introductionVideo",
      itemType: "video",
      videoTitle: "Welcome to Beginnings!!",
      videoLabel: "0:58",
      videoURL: "https://youtu.be/wcjNUHdCwQI",
    },
    { id: "3", docID: "Get a Feel for Hive", itemType: "quiz" },
    { id: "4", docID: "soundout1", itemType: "lesson" },
    { id: "5", docID: "soundout2", itemType: "lesson" },
    { id: "6", docID: "spellingrules1", itemType: "lesson" },
    { id: "7", docID: "2024-25 School List: Easy", itemType: "quiz" },
    { id: "8", docID: "whypatterns", itemType: "article" },
  ];

  const [lessonStatusDict, setLessonStatusDict] = useState({});
  const [articleStatusDict, setArticleStatusDict] = useState({});
  const [showLockedAlert, setShowLockedAlert] = useState(false);
  const [showSubscriptionSheet, setShowSubscriptionSheet] = useState(false);

  // Unlocking logic: For userTier0, only the first 3 items are unlocked.
  // For other users, previous items must be completed (or attempted) to unlock the next.
  const isItemCompletedOrAttempted = (ref) => {
    switch (ref.itemType) {
      case "lesson":
        return lessonStatusDict[ref.docID] === "completed";
      case "quiz":
        // For simplicity, we assume quizzes aren't marked as attempted here.
        return false;
      case "article":
        return articleStatusDict[ref.docID] === "completed";
      case "video":
        return true;
      default:
        return false;
    }
  };

  const isUnlocked = (index) => {
    if (userRole === "userTier0") {
      return index < 3;
    }
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!isItemCompletedOrAttempted(itemRefs[i])) {
        return false;
      }
    }
    return true;
  };

  // Fetch completion statuses from Firestore.
  const fetchAllStatuses = async () => {
    // For demo purposes, retrieve user email from localStorage.
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    // Fetch LessonProgress documents.
    const lessonQuery = query(
      collection(db, "LessonProgress"),
      where("userId", "==", userEmail),
      where("status", "==", "completed")
    );
    const lessonSnapshot = await getDocs(lessonQuery);
    let newLessonStatus = {};
    lessonSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.lessonId) {
        newLessonStatus[data.lessonId] = "completed";
      }
    });
    setLessonStatusDict(newLessonStatus);

    // Fetch articleProgress documents.
    const articleQuery = query(
      collection(db, "articleProgress"),
      where("userId", "==", userEmail),
      where("status", "==", "completed")
    );
    const articleSnapshot = await getDocs(articleQuery);
    let newArticleStatus = {};
    articleSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.articleId) {
        newArticleStatus[data.articleId] = "completed";
      }
    });
    setArticleStatusDict(newArticleStatus);
  };

  useEffect(() => {
    fetchAllStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tier0-carousel">
      <div className="tier0-header">
        <h2>Beginnings</h2>
        <button className="more-button" onClick={() => navigate("/tier0roadmap")}>
          More
        </button>
      </div>
      <div className="tier0-items">
        {itemRefs.map((ref, index) => {
          const locked = !isUnlocked(index);
          return (
            <Tier0ItemCard
              key={ref.id}
              itemRef={ref}
              isLocked={locked}
              showLockedAlert={showLockedAlert}
              setShowLockedAlert={setShowLockedAlert}
              lessonStatusDict={lessonStatusDict}
              setLessonStatusDict={setLessonStatusDict}
              articleStatusDict={articleStatusDict}
              setArticleStatusDict={setArticleStatusDict}
              showSubscriptionSheet={showSubscriptionSheet}
              setShowSubscriptionSheet={setShowSubscriptionSheet}
              userRole={userRole}
            />
          );
        })}
      </div>
      {showSubscriptionSheet && (
        <div className="subscription-modal">
          <div className="modal-content">
            <h3>Subscribe for more</h3>
            <p>Please subscribe to unlock this content.</p>
            <button onClick={() => setShowSubscriptionSheet(false)}>Close</button>
          </div>
        </div>
      )}
      {showLockedAlert && (
        <div className="subscription-modal">
          <div className="modal-content">
            <h3>Locked</h3>
            <p>You must complete (or attempt) all previous items first.</p>
            <button onClick={() => setShowLockedAlert(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Tier0ItemCard = ({
  itemRef,
  isLocked,
  showLockedAlert,
  setShowLockedAlert,
  lessonStatusDict,
  setLessonStatusDict,
  articleStatusDict,
  setArticleStatusDict,
  showSubscriptionSheet,
  setShowSubscriptionSheet,
  userRole,
}) => {
  const navigate = useNavigate();
  const db = getFirestore();

  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    const fetchItemFromFirestore = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        if (itemRef.itemType === "lesson") {
          const q = query(
            collection(db, "lessons"),
            where("lessonId", "==", itemRef.docID),
            limit(1)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setLesson(snapshot.docs[0].data());
          } else {
            setErrorMessage("No matching lesson found.");
          }
        } else if (itemRef.itemType === "quiz") {
          const q = query(
            collection(db, "Quiz"),
            where("quizName", "==", itemRef.docID),
            limit(1)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setQuiz(snapshot.docs[0].data());
          } else {
            setErrorMessage("No matching quiz found.");
          }
        } else if (itemRef.itemType === "article") {
          const q = query(
            collection(db, "articles"),
            where("articleId", "==", itemRef.docID),
            limit(1)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setArticle(snapshot.docs[0].data());
          } else {
            setErrorMessage("No matching article found.");
          }
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
      setIsLoading(false);
    };
    if (itemRef.itemType !== "video") {
      fetchItemFromFirestore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemRef]);

  const handleTapOnLocked = () => {
    if (userRole === "userTier0") {
      setShowSubscriptionSheet(true);
    } else {
      setShowLockedAlert(true);
    }
  };

  const markLessonAsCompletedIfNeeded = async (lessonData) => {
    if (lessonStatusDict[lessonData.lessonId] === "completed") return;
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    try {
      const docRef = doc(collection(db, "LessonProgress")); // auto-ID
      await setDoc(docRef, {
        userId: userEmail,
        lessonId: lessonData.lessonId,
        status: "completed",
        timestamp: serverTimestamp(),
      });
      setLessonStatusDict((prev) => ({ ...prev, [lessonData.lessonId]: "completed" }));
    } catch (err) {
      console.error("Error marking lesson as completed:", err);
    }
  };

  const markArticleAsCompletedIfNeeded = async (articleData) => {
    if (articleStatusDict[articleData.articleId] === "completed") return;
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    try {
      const docRef = doc(collection(db, "articleProgress"));
      await setDoc(docRef, {
        userId: userEmail,
        articleId: articleData.articleId,
        status: "completed",
        timestamp: serverTimestamp(),
      });
      setArticleStatusDict((prev) => ({ ...prev, [articleData.articleId]: "completed" }));
    } catch (err) {
      console.error("Error marking article as completed:", err);
    }
  };

  const handleCardClick = () => {
    if (isLocked) {
      handleTapOnLocked();
    } else {
      if (itemRef.itemType === "lesson" && lesson) {
        markLessonAsCompletedIfNeeded(lesson);
        navigate(`/lessons/${lesson.lessonId}`);
      } else if (itemRef.itemType === "quiz" && quiz) {
        navigate(`/quizzes/${quiz.quizName}`);
      } else if (itemRef.itemType === "article" && article) {
        markArticleAsCompletedIfNeeded(article);
        navigate(`/articles/${article.articleId}`);
      } else if (itemRef.itemType === "video") {
        setShowVideoPlayer(true);
      }
    }
  };

  // Helper to extract YouTube video ID.
  const getYoutubeID = (url) => {
    try {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    } catch (e) {
      return null;
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="tier0-card">Loading...</div>;
    }
    if (errorMessage) {
      return <div className="tier0-card error">{errorMessage}</div>;
    }
    switch (itemRef.itemType) {
      case "lesson":
        if (lesson) {
          return (
            <div className="tier0-card-content">
              <div className="card-image-container">
                <img
                  src={lesson.imageUrl || "/placeholder.png"}
                  alt={lesson.title}
                  className="card-image"
                />
                {isLocked && (
                  <div className="overlay">
                    <FaLock className="lock-icon" />
                  </div>
                )}
                <div className="bottom-right-label">
                  {lesson.difficulty} • {lesson.duration}
                </div>
              </div>
              <div className="card-title">{lesson.title}</div>
            </div>
          );
        } else {
          return <div className="tier0-card">Loading...</div>;
        }
      case "quiz":
        if (quiz) {
          return (
            <div className="tier0-card-content">
              <div className="card-image-container">
                <img
                  src={quiz.image || "/placeholder.png"}
                  alt={quiz.quizName}
                  className="card-image"
                />
                {isLocked && (
                  <div className="overlay">
                    <FaLock className="lock-icon" />
                  </div>
                )}
                <div className="bottom-right-label">
                  {quiz.numberOfWords} Words
                </div>
              </div>
              <div className="card-title">{quiz.quizName}</div>
            </div>
          );
        } else {
          return <div className="tier0-card">Loading...</div>;
        }
      case "article":
        if (article) {
          return (
            <div className="tier0-card-content">
              <div className="card-image-container">
                <img
                  src={article.imageUrl || "/placeholder.png"}
                  alt={article.name}
                  className="card-image"
                />
                {isLocked && (
                  <div className="overlay">
                    <FaLock className="lock-icon" />
                  </div>
                )}
                <div className="bottom-right-label">
                  {formattedDate(article.uploadDate)}
                </div>
              </div>
              <div className="card-title">{article.name}</div>
            </div>
          );
        } else {
          return <div className="tier0-card">Loading...</div>;
        }
      case "video":
        const videoId = getYoutubeID(itemRef.videoURL);
        const thumbnailURL = videoId
          ? `https://img.youtube.com/vi/${videoId}/0.jpg`
          : "/placeholder.png";
        return (
          <div className="tier0-card-content">
            <div className="card-image-container">
              <img
                src={thumbnailURL}
                alt={itemRef.videoTitle || "Video"}
                className="card-image"
              />
              {isLocked && (
                <div className="overlay">
                  <FaLock className="lock-icon" />
                </div>
              )}
              {!isLocked && (
                <div className="play-button">
                  <FaPlayCircle />
                </div>
              )}
            </div>
            <div className="card-title">
              {itemRef.videoTitle || "Introduction Video"}
            </div>
          </div>
        );
      default:
        return <div className="tier0-card">Unknown item type</div>;
    }
  };

  return (
    <div className="tier0-card" onClick={handleCardClick}>
      {renderContent()}
      {showVideoPlayer && itemRef.itemType === "video" && (
        <div className="video-modal">
          <div className="video-content">
            <button
              className="close-button"
              onClick={() => setShowVideoPlayer(false)}
            >
              Close
            </button>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${getYoutubeID(itemRef.videoURL)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tier0Carousel;
