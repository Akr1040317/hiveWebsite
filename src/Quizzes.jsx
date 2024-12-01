// Quizzes.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { FaLock, FaArrowRight } from 'react-icons/fa';
import SubscriptionModal from './SubscriptionModal';
import './Quizzes.css';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizScores, setQuizScores] = useState({});
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userRole, setUserRole] = useState('userTier1');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
        }
      } else {
        navigate('/'); // Redirect to login if not signed in
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesCollection = collection(db, 'Quiz');
      const quizzesSnapshot = await getDocs(quizzesCollection);
      const quizzesData = quizzesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizzesData);
    };

    const fetchQuizScores = async () => {
      if (userId) {
        const scoresDocRef = doc(db, 'quizScores', userId);
        const scoresDoc = await getDoc(scoresDocRef);
        if (scoresDoc.exists()) {
          setQuizScores(scoresDoc.data());
        }
      }
    };

    fetchQuizzes();
    fetchQuizScores();
  }, [db, userId]);

  // Sort quizzes: unlocked first, then locked
  const sortedQuizzes = quizzes.slice().sort((quiz1, quiz2) => {
    const isQuiz1Allowed = quiz1.userGroups.includes(userRole);
    const isQuiz2Allowed = quiz2.userGroups.includes(userRole);
    return isQuiz1Allowed === isQuiz2Allowed ? 0 : isQuiz1Allowed ? -1 : 1;
  });

  return (
    <div className="quizzes-view">
      {/* Header Bar */}
      <div className="quizzes-header flex flex-col bg-[#004afd] p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white">Spelling Quizzes</h2>
        <p className="subtitle text-white">
          Welcome to the Spelling Quizzes! Here, you can put your knowledge to the test and
          practice the skills and patterns you've learned in our lessons. Dive into these
          interactive challenges and celebrate your progress with every question you answer
          correctly. Happy spelling!
        </p>
      </div>

      {/* Quizzes List */}
      <div className="quizzes-list">
        {sortedQuizzes.length > 0 ? (
          sortedQuizzes.map((quiz) => {
            const isAllowed = quiz.userGroups.includes(userRole);
            const isLocked = !isAllowed;
            const userScore = quizScores[quiz.quizName] || 0;
            return (
              <div key={quiz.id} className="quiz-row-wrapper">
                <button
                  className="quiz-row"
                  onClick={() => {
                    if (isLocked) {
                      setSelectedQuiz(quiz);
                      setShowSubscriptionModal(true);
                    } else {
                      navigate(`/quiz/${quiz.quizName}`);
                    }
                  }}
                >
                  {quizRow(quiz, userScore, isLocked)}
                </button>
              </div>
            );
          })
        ) : (
          <p className="loading-text">Loading quizzes...</p>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedQuiz && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  );
}

function quizRow(quiz, userScore, isLocked) {
  const progress = Math.min(userScore, quiz.numberOfWords) / quiz.numberOfWords;

  return (
    <div className="quiz-row-content">
      {/* Apply overlay if quiz is locked */}
      {isLocked && <div className="quiz-row-overlay"></div>}

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <svg className="progress-circle" viewBox="0 0 36 36">
          <path
            className="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle-progress"
            strokeDasharray={`${progress * 100}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="circle-text">
            {`${userScore} / ${quiz.numberOfWords}`}
          </text>
        </svg>
      </div>

      {/* Quiz Title */}
      <div className="quiz-title">
        {quiz.quizName}
      </div>

      {/* Icon */}
      <div className="quiz-icon">
        {isLocked ? (
          <FaLock className="icon" />
        ) : (
          <FaArrowRight className="icon" />
        )}
      </div>
    </div>
  );
}
