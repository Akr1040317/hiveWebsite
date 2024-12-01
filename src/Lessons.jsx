// Lessons.jsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import LessonCard from './LessonCard';
import SubscriptionModal from './SubscriptionModal';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './Lessons.css'; // Import your custom CSS
import honeyDrop from './assets/honeyDrop.png'; // Import the honeyDrop image if needed

export default function Lessons() {
  const [categories, setCategories] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userRole, setUserRole] = useState('usertier1'); // Default role
  const [username, setUsername] = useState('Guest');
  const [points, setPoints] = useState(0); // If you want to display points
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = await getDocs(collection(db, 'users'));
      userDoc.forEach((doc) => {
        if (doc.id === uid) {
          const userData = doc.data();
          setUserRole(userData.role.toLowerCase());
          setUsername(userData.username);
          setPoints(userData.pointsWeekly || 0); // Assuming points are stored here
        }
      });
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        navigate('/'); // Redirect to login if not signed in
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const storage = getStorage();

      const categoriesData = await Promise.all(
        categoriesSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageRef = ref(storage, data.imageURL);
          const imageURL = await getDownloadURL(imageRef);
          return { id: doc.id, ...data, imageURL };
        })
      );

      setCategories(categoriesData);
    };

    fetchCategories();
  }, [db]);

  const commonCategories = [
    'English Lessons',
    'Latin Lessons',
    'Greek Lessons',
    "Speller's Toolbox",
  ];
  const restrictedAccessRoles = ['admin', 'usertier2', 'usertier3'];

  const categoriesWithLockStatus = categories
    .map((category) => {
      const isLocked = !(
        commonCategories.includes(category.categoryId) ||
        restrictedAccessRoles.includes(userRole)
      );
      return { ...category, isLocked };
    })
    .sort((a, b) => a.isLocked - b.isLocked); // Sort unlocked categories to the top

  return (
    <div className="lessons-view">
      {/* Header Bar */}
      <div className="lessons-header flex items-center bg-[#004afd] p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white">Spelling Lessons</h2>
        <div className="flex-grow"></div> {/* Spacer to push points to the right */}
        {/* Optional: Display points */}
        <div className="points-container flex items-center px-3 py-0.5 rounded-lg">
            {/* Text Section */}
        <p className="subtitle">
          Welcome to Spelling Lessons! Here, you will begin your path to word wisdom.
          Explore every language's patterns, quirks, tips, tricks, and more! Now let's get started :)
        </p>
        </div>
      </div>

      

      {/* Categories Grid */}
      <div className="categories-grid">
        {categoriesWithLockStatus.map((category) => (
          <LessonCard
            key={category.id}
            imageURL={category.imageURL}
            title={category.categoryId}
            lessonsCount={category.lessons.length}
            totalTime={category.time}
            isLocked={category.isLocked}
            onClick={() => {
              if (category.isLocked) {
                setSelectedCategory(category);
                setShowSubscriptionModal(true);
              } else {
                // Navigate to CategoryView or desired route
                navigate(`/category/${category.id}`);
              }
            }}
          />
        ))}
      </div>

      {/* No Categories Available */}
      {categoriesWithLockStatus.length === 0 && (
        <p className="no-lessons">No lessons available.</p>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  );
}
