// LessonManagement.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'; // Firestore functions
import { db, storage } from './firebaseConfig'; // Firebase config (ensure storage is exported)
import {
  FaPencilAlt,
  FaTrashAlt,
  FaUpload,
  FaCheck,
  FaTimes,
  FaImage,
  FaDownload,
} from 'react-icons/fa';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'; // Firebase Storage functions
import Select from 'react-select';
import Papa from 'papaparse'; // For CSV parsing

const LessonManagement = () => {
  // State variables
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null); // Selected lesson
  const [isCreatingLesson, setIsCreatingLesson] = useState(false); // Creating a new lesson

  // Form state variables for creating/editing lessons
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [patterns, setPatterns] = useState([{ bullet: '•', text: '' }]);
  const [miniLessonTitle, setMiniLessonTitle] = useState('');
  const [miniLessons, setMiniLessons] = useState([{ text: '' }]);
  const [summary, setSummary] = useState([{ bullet: '•', text: '' }]);
  const [userGroups, setUserGroups] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // States for handling image upload modals
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(null);

  // States for handling delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // State for success messages
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // State for user groups options
  const [allUserGroups, setAllUserGroups] = useState([]); // All user groups from Firestore
  const [selectedUserGroupsOptions, setSelectedUserGroupsOptions] = useState([]); // Selected user groups in the dropdown

  // Refs for auto-resizing textareas
  const introductionRef = useRef(null);
  const patternRefs = useRef([]);
  const summaryRefs = useRef([]);
  const miniLessonRefs = useRef([]);

  // States for handling CSV upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedWords, setUploadedWords] = useState('');
  const [uploadOption, setUploadOption] = useState('append'); // 'append' or 'replace'
  const [showSecondModal, setShowSecondModal] = useState(false); // State for the second modal
  const [processedWords, setProcessedWords] = useState([]); // State for holding processed words

  // States for handling duplicate words
  const [showDuplicatePrompt, setShowDuplicatePrompt] = useState(false);
  const [duplicatesFound, setDuplicatesFound] = useState([]);
  const [wordsToSave, setWordsToSave] = useState([]);

  // Additional form fields
  const [summaryTitle, setSummaryTitle] = useState('');
  const [nextLesson, setNextLesson] = useState('');
  const [category, setCategory] = useState('');

  // Categories state
  const [categories, setCategories] = useState([]);

  // States for creating a new category
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
  const [newCategoryImageURL, setNewCategoryImageURL] = useState('');
  const [newCategoryTime, setNewCategoryTime] = useState('');

  // State to track old category during editing
  const [oldCategory, setOldCategory] = useState('');

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);

  // Fetch user groups from Firestore
  useEffect(() => {
    const fetchUserGroups = async () => {
      const userGroupsCollection = collection(db, 'UserGroups');
      try {
        const userGroupsSnapshot = await getDocs(userGroupsCollection);
        const userGroupsList = userGroupsSnapshot.docs.map((doc) => doc.id);
        setAllUserGroups(userGroupsList);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

  // Fetch lessons from Firestore on mount and when refreshed
  useEffect(() => {
    const fetchLessons = async () => {
      const lessonCollection = collection(db, 'lessons');
      try {
        const lessonSnapshot = await getDocs(lessonCollection);
        let lessonList = lessonSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort the lessons alphabetically by title
        lessonList.sort((a, b) => a.title.localeCompare(b.title));

        setLessons(lessonList);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  // Auto-resize textareas whenever their content changes
  useEffect(() => {
    const autoResizeTextarea = (textarea) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    // Resize introduction
    if (introductionRef.current) {
      autoResizeTextarea(introductionRef.current);
    }

    // Resize patterns
    patternRefs.current.forEach((textarea) => autoResizeTextarea(textarea));

    // Resize miniLessons
    miniLessonRefs.current.forEach((textarea) => autoResizeTextarea(textarea));

    // Resize summary
    summaryRefs.current.forEach((textarea) => autoResizeTextarea(textarea));
  }, [title, lessonId, duration, difficulty, introduction, patterns, miniLessons, summary]);

  // Handle "Add Lesson" button click
  const handleAddLessonClick = () => {
    setIsCreatingLesson(true);
    setSelectedLesson(null);
    // Reset form fields
    resetForm();
  };

  // Handle lesson card click
  const handleCardClick = (lesson) => {
    setSelectedLesson(lesson);
    setIsCreatingLesson(false);
    // Populate form fields with selected lesson data
    populateForm(lesson);
  };

  // Handle new category image upload
  const handleNewCategoryImageUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setNewCategoryImageFile(file);
      setNewCategoryImageURL(url);
    }
  };

  // Handle create category form submission
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newCategoryId || !newCategoryDescription || !newCategoryImageFile || !newCategoryTime) {
      alert('Please fill in all required fields for the new category.');
      return;
    }

    try {
      // Check if category already exists
      const categoryDoc = await getDoc(doc(db, 'categories', newCategoryId));
      if (categoryDoc.exists()) {
        alert('A category with this ID already exists. Please choose a different ID.');
        return;
      }

      // Upload the category image
      const fileName = `${Date.now()}_${newCategoryImageFile.name}`;
      const categoryImageRef = storageRef(storage, `categoryImages/${fileName}`);
      await uploadBytes(categoryImageRef, newCategoryImageFile);
      const categoryImageURL = await getDownloadURL(categoryImageRef);

      // Create the new category document with an empty 'lessons' array
      await setDoc(doc(db, 'categories', newCategoryId), {
        categoryId: newCategoryId,      // Correct field
        description: newCategoryDescription,
        imageURL: categoryImageURL,     // Correct field name
        time: newCategoryTime,
        lessons: [],                     // Initialize with an empty array
      });

      // Update categories state with the new category including 'categoryId' and 'imageURL'
      setCategories([...categories, {
        id: newCategoryId,
        categoryId: newCategoryId,      // Add categoryId field
        description: newCategoryDescription,
        imageURL: categoryImageURL,     // Correct field name
        time: newCategoryTime,
        lessons: [],
      }]);

      // Reset new category form fields
      setNewCategoryId('');
      setNewCategoryDescription('');
      setNewCategoryImageFile(null);
      setNewCategoryImageURL('');
      setNewCategoryTime('');

      // Close the modal
      setShowNewCategoryModal(false);

      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating new category:', error);
      alert('Error creating new category. Check console for details.');
    }
  };


  // Populate form fields for editing
  // Populate form fields for editing
const populateForm = (lesson) => {
  setLessonId(lesson.lessonId || '');
  setTitle(lesson.title || '');
  setDuration(lesson.duration || '');
  setDifficulty(lesson.difficulty || '');
  setIntroduction(lesson.introduction || '');
  setPatterns(
    lesson.patterns && lesson.patterns.length > 0
      ? lesson.patterns.map((pat) => ({
          bullet: pat.bullet || '•',
          text: pat.text || '',
        }))
      : [{ bullet: '•', text: '' }]
  );
  setMiniLessonTitle(lesson.miniLessonTitle || '');
  setMiniLessons(
    lesson.miniLesson.length > 0 ? lesson.miniLesson : [{ text: '' }]
  );
  // Ensure each summary has a bullet
  setSummary(
    lesson.summary && lesson.summary.length > 0
      ? lesson.summary.map((sum) => ({
          bullet: sum.bullet || '•',
          text: sum.text || '',
        }))
      : [{ bullet: '•', text: '' }]
  );
  setUserGroups(lesson.userGroups || []);
  setSelectedUserGroupsOptions(
    lesson.userGroups.map((group) => ({ value: group, label: group }))
  );
  setImageUrl(lesson.imageUrl || ''); // Corrected: 'imageUrl' instead of 'imageURL'
  setImageFile(null);
  setSummaryTitle(lesson.summaryTitle || '');
  setNextLesson(lesson.nextLesson || '');
  setCategory(lesson.category || '');
  setOldCategory(lesson.category || ''); // Track old category
};


  // Reset form fields
  const resetForm = () => {
    setLessonId('');
    setTitle('');
    setDuration('');
    setDifficulty('');
    setIntroduction('');
    setPatterns([{ bullet: '•', text: '' }]);
    setMiniLessonTitle('');
    setMiniLessons([{ text: '' }]);
    setSummary([{ bullet: '•', text: '' }]);
    setUserGroups([]);
    setSelectedUserGroupsOptions([]);
    setImageUrl('');
    setImageFile(null);
    setSummaryTitle('');
    setNextLesson('');
    setCategory('');
    setOldCategory('');
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Upload image to Firebase Storage and get URL
  const uploadImage = async () => {
    if (!imageFile) return imageUrl || '';
    setImageUploading(true);
    const fileName = `${Date.now()}_${imageFile.name}`;
    const storageReference = storageRef(storage, `lessonImages/${fileName}`);
    try {
      await uploadBytes(storageReference, imageFile);
      const url = await getDownloadURL(storageReference);
      setImageUrl(url);
      setImageUploading(false);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploading(false);
      return '';
    }
  };

  // Function to update the 'lessons' array in a category document
  const updateCategoryLessons = async (categoryId, lessonId, action) => {
    if (!categoryId) return;

    const categoryDocRef = doc(db, 'categories', categoryId);
    try {
      if (action === 'add') {
        await updateDoc(categoryDocRef, {
          lessons: arrayUnion(lessonId),
        });
      } else if (action === 'remove') {
        await updateDoc(categoryDocRef, {
          lessons: arrayRemove(lessonId),
        });
      }
    } catch (error) {
      console.error(`Error updating category (${action}) lessons:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!lessonId || !title || !duration || !difficulty || !introduction) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Ensure lessonId is unique when creating or changing
    if (isCreatingLesson || (selectedLesson && lessonId !== selectedLesson.lessonId)) {
      const existingLessonDoc = await getDoc(doc(db, 'lessons', lessonId));
      if (existingLessonDoc.exists()) {
        alert('A lesson with this Lesson ID already exists. Please choose a different Lesson ID.');
        return;
      }
    }
  
    // Upload image and get URL
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        alert('Image upload failed.');
        return;
      }
    }
  
    // Prepare patterns, mini-lessons, and summary by removing empty entries
    const processedPatterns = patterns
      .filter((pat) => pat.text.trim() !== '')
      .map((pat) => ({
        bullet: pat.bullet, // Ensure bullet is included
        text: pat.text,
      }));
  
    const processedSummary = summary
      .filter((sum) => sum.text.trim() !== '')
      .map((sum) => ({
        bullet: sum.bullet, // Ensure bullet is included
        text: sum.text,
      }));
  
    const processedMiniLessons = miniLessons
      .filter((ml) => ml.text.trim() !== '')
      .map((ml) => ({
        text: ml.text,
      }));
  
    // Prepare lesson data
    const lessonData = {
      lessonId,
      title,
      duration,
      difficulty,
      introduction,
      patterns: processedPatterns,
      miniLessonTitle: miniLessonTitle.trim() === '' ? null : miniLessonTitle,
      miniLesson: processedMiniLessons,
      summary: processedSummary,
      summaryTitle, // Newly added field
      nextLesson,    // Newly added field
      imageUrl: uploadedImageUrl || null,
      userGroups,
      category,
    };
  
    try {
      if (isCreatingLesson) {
        // Create a new lesson in Firestore with lessonId as document ID
        await setDoc(doc(db, 'lessons', lessonId), lessonData);
        console.log('Lesson created with ID:', lessonId);
      
        // Update the lessons array
        setLessons((prevLessons) => {
          const updatedLessons = [
            ...prevLessons,
            { id: lessonId, ...lessonData },
          ];
          // Sort the updated lessons array
          updatedLessons.sort((a, b) => a.title.localeCompare(b.title));
          return updatedLessons;
        });
      
        // Update the selected category's 'lessons' array
        await updateCategoryLessons(category, lessonId, 'add');
      
        // Set the selected lesson to the newly created lesson
        const newLesson = { id: lessonId, ...lessonData };
        setSelectedLesson(newLesson);
      
        // Populate the form with the new lesson's data
        populateForm(newLesson);
      
        setIsCreatingLesson(false);
      
        // Show the success modal
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      
        // Refresh lessons list
        await refreshLessons();
      } else if (selectedLesson) {
        if (lessonId !== selectedLesson.lessonId) {
          // Changing lessonId: create new document, copy data, delete old document
          // Check if new lessonId already exists
          const newLessonDoc = await getDoc(doc(db, 'lessons', lessonId));
          if (newLessonDoc.exists()) {
            alert('A lesson with the new Lesson ID already exists. Please choose a different Lesson ID.');
            return;
          }
  
          // Create new document with new lessonId
          await setDoc(doc(db, 'lessons', lessonId), lessonData);
  
          // Delete old document
          await deleteDoc(doc(db, 'lessons', selectedLesson.lessonId));
  
          // Update the lessons array
          setLessons((prevLessons) =>
            prevLessons
              .filter((lesson) => lesson.id !== selectedLesson.lessonId)
              .concat({ id: lessonId, ...lessonData })
              .sort((a, b) => a.title.localeCompare(b.title))
          );
  
          // Update the selected category's 'lessons' array
          await updateCategoryLessons(category, lessonId, 'add');
          await updateCategoryLessons(oldCategory, selectedLesson.lessonId, 'remove');
  
          // Update the selected lesson
          const newLesson = { id: lessonId, ...lessonData };
          setSelectedLesson(newLesson);
  
          // Populate the form with the new lesson's data
          populateForm(newLesson);
  
          setIsCreatingLesson(false);
  
          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          // If lessonId hasn't changed, just update the existing document
          await updateDoc(doc(db, 'lessons', lessonId), lessonData);
          console.log('Lesson updated successfully!');
  
          // Check if category has changed
          if (category !== oldCategory) {
            // Remove from old category
            await updateCategoryLessons(oldCategory, lessonId, 'remove');
            // Add to new category
            await updateCategoryLessons(category, lessonId, 'add');
          }
  
          // Update the lessons array
          setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
              lesson.id === lessonId ? { id: lessonId, ...lessonData } : lesson
            )
          );
  
          // Update the selected lesson
          const updatedLesson = { id: lessonId, ...lessonData };
          setSelectedLesson(updatedLesson);
  
          // Populate the form with the updated lesson's data
          populateForm(updatedLesson);
  
          // Update oldCategory
          setOldCategory(category);
  
          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
  
          // Refresh lessons list to ensure left side reflects changes
          await refreshLessons();
        }
      }
  
      // Refresh lessons list after update/create
      // Optional: If you want to refetch instead of updating state manually
      // await fetchLessons(); // You can define a function to refetch lessons
    } catch (error) {
      console.error('Error submitting lesson:', error);
      alert('Error submitting lesson. Check console for details.');
    }
  };  


  // Handle dynamic fields for patterns
  const handlePatternChange = (index, field, value) => {
    if (field !== 'text') return; // Prevent editing the bullet
    
    const newPatterns = [...patterns];
    newPatterns[index][field] = value;
    setPatterns(newPatterns);
  };
  
  const addPattern = () => {
    setPatterns([...patterns, { bullet: '•', text: '' }]);
  };

  const removePattern = (index) => {
    const newPatterns = patterns.filter((_, i) => i !== index);
    setPatterns(newPatterns);
  };

  // Handle dynamic fields for miniLessons
  const handleMiniLessonChange = (index, value) => {
    const newMiniLessons = [...miniLessons];
    newMiniLessons[index].text = value;
    setMiniLessons(newMiniLessons);
  };

  const addMiniLesson = () => {
    setMiniLessons([...miniLessons, { text: '' }]);
  };

  const removeMiniLesson = (index) => {
    const newMiniLessons = miniLessons.filter((_, i) => i !== index);
    setMiniLessons(newMiniLessons);
  };

  // Handle dynamic fields for summary
  const handleSummaryChange = (index, field, value) => {
    if (field !== 'text') return; // Prevent editing the bullet
    
    const newSummary = [...summary];
    newSummary[index][field] = value;
    setSummary(newSummary);
  };

  const addSummary = () => {
    setSummary([...summary, { bullet: '•', text: '' }]);
  };

  const removeSummary = (index) => {
    const newSummary = summary.filter((_, i) => i !== index);
    setSummary(newSummary);
  };

  // Handle userGroups using react-select
  const handleUserGroupsChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === 'select_all')) {
      setUserGroups(allUserGroups);
      setSelectedUserGroupsOptions([{ value: 'select_all', label: 'Select All' }]);
    } else {
      setUserGroups(selectedOptions.map((option) => option.value));
      setSelectedUserGroupsOptions(selectedOptions);
    }
  };

  // Handle bullet indentation (prepend #INDENT#)
  const handleIndent = (type, index) => {
    if (type === 'pattern') {
      const newPatterns = [...patterns];
      if (!newPatterns[index].text.startsWith('#INDENT#')) {
        newPatterns[index].text = `#INDENT#${newPatterns[index].text}`;
        setPatterns(newPatterns);
      }
    } else if (type === 'summary') {
      const newSummary = [...summary];
      if (!newSummary[index].text.startsWith('#INDENT#')) {
        newSummary[index].text = `#INDENT#${newSummary[index].text}`;
        setSummary(newSummary);
      }
    }
  };

  // Handle bullet unindentation (remove #INDENT#)
  const handleUnindent = (type, index) => {
    if (type === 'pattern') {
      const newPatterns = [...patterns];
      if (newPatterns[index].text.startsWith('#INDENT#')) {
        newPatterns[index].text = newPatterns[index].text.replace(
          '#INDENT#',
          ''
        );
        setPatterns(newPatterns);
      }
    } else if (type === 'summary') {
      const newSummary = [...summary];
      if (newSummary[index].text.startsWith('#INDENT#')) {
        newSummary[index].text = newSummary[index].text.replace(
          '#INDENT#',
          ''
        );
        setSummary(newSummary);
      }
    }
  };

  // Upload image confirmation
  const handleConfirmImageUpload = async () => {
    if (!imageFile) return;
  
    // Validate image
    const file = imageFile;
    const maxSizeInBytes = 100 * 1024; // 100 KB
    if (file.size > maxSizeInBytes) {
      alert('Image size exceeds 100 KB. Please choose a smaller image.');
      return;
    }
  
    if (file.type !== 'image/jpeg') {
      alert('Only JPEG images are allowed.');
      return;
    }
  
    // Check aspect ratio
    const img = new Image();
    img.src = imagePreviewURL;
    img.onload = async () => {
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const desiredAspectRatio = 266 / 190; // ~1.4
      const deviation =
        Math.abs(aspectRatio - desiredAspectRatio) / desiredAspectRatio;
      if (deviation > 0.1) {
        // Allow 10% deviation
        alert(
          'Image aspect ratio must be approximately 1.4 (e.g., 266×190 pixels).'
        );
        return;
      }
  
      // Upload image
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        // Retain the existing imageUrl if creating a new lesson
        // Or set the new imageUrl if editing
  
        // Close both modals
        setShowImagePreviewModal(false);
        setShowImageUploadModal(false);
      } else {
        alert('Image upload failed.');
      }
    };
  };
  

  // Handle image file upload for existing lesson
  const handleImageFileUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setImagePreviewURL(url);
      setShowImagePreviewModal(true);
    }
  };

  // Handle deleting a lesson
  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      // Remove the lessonId from the associated category's 'lessons' array
      await updateCategoryLessons(selectedLesson.category, selectedLesson.lessonId, 'remove');

      // Delete the lesson document
      await deleteDoc(doc(db, 'lessons', selectedLesson.lessonId));
      console.log('Lesson deleted successfully!');
      alert('Lesson deleted successfully!');
      
      // Refresh lessons list
      const lessonSnapshot = await getDocs(collection(db, 'lessons'));
      let lessonList = lessonSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      lessonList.sort((a, b) => a.title.localeCompare(b.title));
      setLessons(lessonList);
      
      // Reset states
      resetForm();
      setSelectedLesson(null);
      setIsCreatingLesson(false);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      setTimeout(() => setShowDeleteSuccessModal(false), 3000);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson. Check console for details.');
    }
  };

  // Handle CSV upload
  const handleUploadCSVClick = () => {
    setShowUploadModal(true);
  };

  const handleDownloadCSVClick = () => {
    if (selectedLesson && selectedLesson.patterns && selectedLesson.patterns.length > 0) {
      const csvContent = selectedLesson.patterns.map(pat => `${pat.text}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedLesson.lessonId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No patterns available to download.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        // Parse CSV text using PapaParse for better reliability
        const parsed = Papa.parse(text, { header: false });
        const words = parsed.data
          .map((row) => row[0]?.trim())
          .filter((word) => word !== undefined && word !== '');
        setUploadedWords(words.join('\n')); // Set the uploaded words in state
        setProcessedWords(words); // Set the processed words to show in the second modal

        setShowUploadModal(false); // Close the first modal
        setShowSecondModal(true); // Show the second modal after processing
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .csv file.');
    }
  };

  // Handle adding uploaded words
  const handleAddUploadedWords = () => {
    const wordsArray = processedWords.map((word) => word.trim()).filter((word) => word !== '');

    if (wordsArray.length === 0) {
      alert('No valid words were found in the uploaded file.');
      return;
    }

    if (isCreatingLesson) {
      // For new lesson creation
      if (uploadOption === 'append') {
        const newPatterns = [...patterns, ...wordsArray.map(word => ({ text: word }))];
        setPatterns(newPatterns);
      } else if (uploadOption === 'replace') {
        const newPatterns = wordsArray.map(word => ({ text: word }));
        setPatterns(newPatterns);
      }
    } else if (selectedLesson) {
      // For existing lesson editing
      if (uploadOption === 'append') {
        const newPatterns = [...selectedLesson.patterns, ...wordsArray.map(word => ({ text: word }))];
        setSelectedLesson({ ...selectedLesson, patterns: newPatterns });
      } else if (uploadOption === 'replace') {
        const newPatterns = wordsArray.map(word => ({ text: word }));
        setSelectedLesson({ ...selectedLesson, patterns: newPatterns });
      }
    }

    // Close the modal
    setShowSecondModal(false);
  };

  // Handle modal close
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setShowSecondModal(false); // Ensure second modal is closed too
  };

  // Handle deleting a pattern
  const deletePattern = (index) => {
    const newPatterns = patterns.filter((_, i) => i !== index);
    setPatterns(newPatterns);
  };

  // Handle deleting a mini-lesson
  const deleteMiniLesson = (index) => {
    const newMiniLessons = miniLessons.filter((_, i) => i !== index);
    setMiniLessons(newMiniLessons);
  };

  // Handle deleting a summary
  const deleteSummary = (index) => {
    const newSummary = summary.filter((_, i) => i !== index);
    setSummary(newSummary);
  };

  // Function to save patterns to Firestore after modification
  const savePatterns = async () => {
    if (selectedLesson) {
      // Filter out any undefined or empty patterns from the array
      const filteredPatterns = selectedLesson.patterns.filter((pat) => pat.text && pat.text.trim() !== '');

      if (filteredPatterns.length === 0) {
        alert('The lesson must contain at least one pattern.');
        return;
      }

      // Check for duplicates
      const patternCounts = {};
      const duplicates = [];

      filteredPatterns.forEach((pat) => {
        const lowerPat = pat.text.toLowerCase().trim();
        if (patternCounts[lowerPat]) {
          patternCounts[lowerPat]++;
          if (patternCounts[lowerPat] === 2) {
            duplicates.push(pat.text);
          }
        } else {
          patternCounts[lowerPat] = 1;
        }
      });

      if (duplicates.length > 0) {
        setDuplicatesFound(duplicates);
        setShowDuplicatePrompt(true);
        setWordsToSave(filteredPatterns); // Store words to process after user decision
        return; // Exit the function until the user makes a decision
      }

      // Proceed to save without duplicates
      await savePatternsToFirestore(filteredPatterns);
    }
  };

  const savePatternsToFirestore = async (patternsToSave) => {
    const lessonDocRef = doc(db, 'lessons', selectedLesson.lessonId);
    try {
      await updateDoc(lessonDocRef, {
        patterns: patternsToSave,
      });
      setSelectedLesson((prevLesson) => ({
        ...prevLesson,
        patterns: patternsToSave,
      }));
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide it after 3 seconds
      console.log('Patterns updated successfully!');
      // Refresh lessons list to ensure left side reflects changes
      await refreshLessons();
    } catch (error) {
      console.error('Error updating patterns:', error);
    }
  };

  // Handle duplicate patterns prompt
  const handleDuplicatePrompt = async (keepDuplicates) => {
    if (keepDuplicates) {
      if (isCreatingLesson) {
        // Proceed to create lesson with duplicates
        await createOrUpdateLesson(wordsToSave, true);
      } else {
        // For editing existing lesson
        await savePatternsToFirestore(wordsToSave);
      }
    } else {
      // Remove duplicates
      const uniquePatternsMap = new Map();
      wordsToSave.forEach((pat) => {
        const lowerPat = pat.text.toLowerCase().trim();
        if (!uniquePatternsMap.has(lowerPat)) {
          uniquePatternsMap.set(lowerPat, pat);
        }
      });
      const uniquePatterns = Array.from(uniquePatternsMap.values());

      if (isCreatingLesson) {
        // Proceed to create lesson without duplicates
        await createOrUpdateLesson(uniquePatterns, false);
      } else {
        // For editing existing lesson
        await savePatternsToFirestore(uniquePatterns);
      }
    }
    setShowDuplicatePrompt(false);
  };

  const createOrUpdateLesson = async (patternsToSave, keepDuplicates) => {
    try {
      // Prepare lesson data with filtered patterns
      const lessonData = {
        lessonId,
        title,
        duration,
        difficulty,
        introduction,
        patterns: patternsToSave.map((pat) => ({
          bullet: pat.bullet, // Ensure bullet is included
          text: pat.text,
        })),
        miniLessonTitle: miniLessonTitle.trim() === '' ? null : miniLessonTitle,
        miniLesson: miniLessons.filter((ml) => ml.text.trim() !== ''),
        summary: summary
          .filter((sum) => sum.text.trim() !== '')
          .map((sum) => ({
            bullet: sum.bullet, // Ensure bullet is included
            text: sum.text,
          })),
        summaryTitle, // Newly added field
        nextLesson,    // Newly added field
        imageUrl: imageUrl || null,
        userGroups,
        category,
      };
  
      if (isCreatingLesson) {
        // Create a new lesson in Firestore with lessonId as document ID
        await setDoc(doc(db, 'lessons', lessonId), lessonData);
        console.log('Lesson created with ID:', lessonId);
      
        // Update the lessons array
        setLessons((prevLessons) => {
          const updatedLessons = [
            ...prevLessons,
            { id: lessonId, ...lessonData },
          ];
          // Sort the updated lessons array
          updatedLessons.sort((a, b) => a.title.localeCompare(b.title));
          return updatedLessons;
        });
      
        // Update the selected category's 'lessons' array
        await updateCategoryLessons(category, lessonId, 'add');
      
        // Set the selected lesson to the newly created lesson
        const newLesson = { id: lessonId, ...lessonData };
        setSelectedLesson(newLesson);
      
        // Do NOT reset the form
        // resetForm();
      
        // Set isCreatingLesson to false to switch to edit mode
        setIsCreatingLesson(false);
      
        // Populate the form with the new lesson's data
        populateForm(newLesson);
      
        // Show the success modal
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      
        // Refresh the lessons list to include the new lesson
        await refreshLessons();
      } else if (selectedLesson) {
        if (lessonId !== selectedLesson.lessonId) {
          // Changing lessonId: create new document, copy data, delete old document
          // Check if new lessonId already exists
          const newLessonDoc = await getDoc(doc(db, 'lessons', lessonId));
          if (newLessonDoc.exists()) {
            alert('A lesson with the new Lesson ID already exists. Please choose a different Lesson ID.');
            return;
          }
  
          // Create new document with new lessonId
          await setDoc(doc(db, 'lessons', lessonId), lessonData);
  
          // Delete old document
          await deleteDoc(doc(db, 'lessons', selectedLesson.lessonId));
  
          // Update the lessons array
          setLessons((prevLessons) =>
            prevLessons
              .filter((lesson) => lesson.id !== selectedLesson.lessonId)
              .concat({ id: lessonId, ...lessonData })
              .sort((a, b) => a.title.localeCompare(b.title))
          );
  
          // Update the selected category's 'lessons' array
          await updateCategoryLessons(category, lessonId, 'add');
          await updateCategoryLessons(oldCategory, selectedLesson.lessonId, 'remove');
  
          // Set the selected lesson to the newly created lesson
          const newLesson = { id: lessonId, ...lessonData };
          setSelectedLesson(newLesson);
  
          // Populate the form with the new lesson's data
          populateForm(newLesson);
  
          setIsCreatingLesson(false);
  
          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          // If lessonId hasn't changed, just update the existing document
          await updateDoc(doc(db, 'lessons', lessonId), lessonData);
          console.log('Lesson updated successfully!');
  
          // Check if category has changed
          if (category !== oldCategory) {
            // Remove from old category
            await updateCategoryLessons(oldCategory, lessonId, 'remove');
            // Add to new category
            await updateCategoryLessons(category, lessonId, 'add');
          }
  
          // Update the lessons array
          setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
              lesson.id === lessonId ? { id: lessonId, ...lessonData } : lesson
            )
          );
  
          // Update the selected lesson
          const updatedLesson = { id: lessonId, ...lessonData };
          setSelectedLesson(updatedLesson);
  
          // Populate the form with the updated lesson's data
          populateForm(updatedLesson);
  
          // Update oldCategory
          setOldCategory(category);
  
          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
  
          // Refresh lessons list to ensure left side reflects changes
          await refreshLessons();
        }
      }
    } catch (error) {
      console.error('Error submitting lesson:', error);
      alert('Error submitting lesson. Check console for details.');
    }
  };
  

  // Function to refresh lessons from Firestore
  const refreshLessons = async () => {
    const lessonCollection = collection(db, 'lessons');
    try {
      const lessonSnapshot = await getDocs(lessonCollection);
      let lessonList = lessonSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the lessons alphabetically by title
      lessonList.sort((a, b) => a.title.localeCompare(b.title));

      setLessons(lessonList);
    } catch (error) {
      console.error('Error refreshing lessons:', error);
    }
  };

  if (!lessons) {
    return <p className="text-white">Loading lessons...</p>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section - Scrollable List */}
      <div className="left-section w-1/3 overflow-y-auto h-full p-4 bg-[#1a1a1a]">
        {/* Add Lesson Card */}
        <div
          className={`bg-[#202020] p-4 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer ${
            isCreatingLesson
              ? 'brightness-150'
              : 'brightness-100 hover:brightness-125'
          }`}
          style={{ transition: '0.3s ease' }}
          onClick={handleAddLessonClick}
        >
          <h2 className="text-xl text-white font-bold text-center">Add Lesson</h2>
        </div>

        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-[#202020] p-4 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer ${
                selectedLesson?.id === lesson.id ? 'brightness-150' : 'brightness-100 hover:brightness-125'
              }`}
              style={{ transition: '0.3s ease' }}
              onClick={() => handleCardClick(lesson)}
            >
              <div
                className="relative w-full"
                style={{ paddingTop: '71.16%' /* (190/266)*100% ≈ 71.16% */ }}
              >
                <img
                  src={
                    lesson.imageUrl ||
                    'https://via.placeholder.com/266x190.png?text=No+Image'
                  }
                  alt={lesson.title}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl text-white font-bold mt-4 mb-2">
                {lesson.title}
              </h2>
              {lesson.category && (
                <p className="text-gray-400 mb-1">Category: {lesson.category}</p>
              )}
              <p className="text-gray-400 mb-1">Difficulty: {lesson.difficulty}</p>
              <p className="text-gray-400 mb-2">Duration: {lesson.duration}</p>
              <div className="flex flex-wrap">
                {lesson.userGroups && lesson.userGroups.length > 0 ? (
                  lesson.userGroups.map((group, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-white text-xs px-2 py-1 rounded mr-2 mb-2"
                    >
                      {group}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">N/A</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No lessons available.</p>
        )}
      </div>

      {/* Right Section - Detailed Info or Create/Edit Lesson Form */}
      <div className="right-section w-2/3 p-4 rounded-lg ml-4 h-full overflow-y-auto bg-[#1a1a1a]">
        {isCreatingLesson || selectedLesson ? (
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">
              {isCreatingLesson
                ? 'Create New Lesson'
                : `Edit Lesson: ${selectedLesson.title}`}
            </h2>
            <form onSubmit={handleSubmit}>
                {/* Lesson Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Lesson Image:</label>
                  
                  {/* Display Current Image if Available */}
                  {imageUrl && (
                    <div className="mb-2">
                      <img
                        src={imageUrl}
                        alt="Lesson"
                        className="w-64 h-auto object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Upload/Change Image Button */}
                  <button
                    type="button"
                    className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                    onClick={() => setShowImageUploadModal(true)}
                  >
                    <FaUpload className="mr-2" /> {imageUrl ? 'Change Image' : 'Upload Image'}
                  </button>
                </div>
              {/* Lesson ID */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Lesson ID<span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  required
                />
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Title<span className="text-red-500">*</span>:
                </label>
                <textarea
                  ref={introductionRef}
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  rows={1}
                />
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Category<span className="text-red-500">*</span>:
                </label>
                <Select
                  options={categories.map(category => ({ value: category.categoryId, label: category.categoryId }))}
                  value={
                    category
                      ? { value: category, label: category }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setCategory(selectedOption ? selectedOption.value : '');
                  }}
                  placeholder="Select category..."
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#202020',
                      borderColor: '#555',
                      color: 'white',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#202020',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#ffa500' : '#202020',
                      color: 'white',
                      ':hover': {
                        backgroundColor: '#ffa500',
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white',
                    }),
                  }}
                />
              </div>

              {/* Add "New Category" button */}
              <div className="mb-4">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                  onClick={() => setShowNewCategoryModal(true)}
                >
                  <FaPencilAlt className="mr-2" /> New Category
                </button>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Duration<span className="text-red-500">*</span>:
                </label>
                <textarea
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                  placeholder="e.g., 30 minutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  rows={1}
                />
              </div>

              {/* Difficulty */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Difficulty<span className="text-red-500">*</span>:
                </label>
                <select
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  required
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* User Groups Selection */}
              <div className="mb-4">
                <label className="block text-white mb-2">User Groups:</label>
                <div style={{ width: '100%' }}>
                  <Select
                    isMulti
                    options={[
                      { value: 'select_all', label: 'Select All' },
                      ...allUserGroups.map((group) => ({ value: group, label: group })),
                    ]}
                    value={
                      userGroups.length === allUserGroups.length
                        ? [{ value: 'select_all', label: 'Select All' }]
                        : userGroups.map((group) => ({ value: group, label: group }))
                    }
                    onChange={handleUserGroupsChange}
                    placeholder="Select user groups..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#202020',
                        borderColor: '#555',
                        color: 'white',
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#202020',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#ffa500' : '#202020',
                        color: 'white',
                        ':hover': {
                          backgroundColor: '#ffa500',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#ffa500',
                        color: 'white',
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white',
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Introduction */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Introduction<span className="text-red-500">*</span>:
                </label>
                <textarea
                  ref={introductionRef}
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                  rows={4}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Patterns */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Patterns:</label>
                {patterns.map((pattern, index) => (
                  <div key={index} className="flex items-center mb-2">
                    {/* Static Bullet Point Symbol */}
                    <span className="text-white mr-2">•</span>
                    <textarea
                      ref={(el) => (patternRefs.current[index] = el)}
                      type="text"
                      placeholder="Pattern Text"
                      className="flex-1 p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                      value={pattern.text}
                      onChange={(e) =>
                        handlePatternChange(index, 'text', e.target.value)
                      }
                      rows={1}
                    />
                    <div className="flex space-x-2 ml-2">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removePattern(index)}
                        title="Remove Pattern"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-green-500"
                        onClick={() => handleIndent('pattern', index)}
                        title="Indent"
                      >
                        &#8679;
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-blue-500"
                        onClick={() => handleUnindent('pattern', index)}
                        title="Unindent"
                      >
                        &#8681;
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center text-gray-300 hover:text-white mt-2"
                  onClick={addPattern}
                >
                  <FaPencilAlt className="mr-2" /> Add Pattern
                </button>
              </div>

              {/* Mini Lesson Title */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Mini Lesson Title:</label>
                <textarea
                  ref={(el) => (miniLessonRefs.current[0] = el)}
                  type="text"
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                  value={miniLessonTitle}
                  onChange={(e) => setMiniLessonTitle(e.target.value)}
                  rows={1}
                />
              </div>

              {/* Mini Lessons */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Mini Lessons:</label>
                {miniLessons.map((miniLesson, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <textarea
                      ref={(el) => (miniLessonRefs.current[index] = el)}
                      placeholder="Mini Lesson Text"
                      className="flex-1 p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                      rows={2}
                      value={miniLesson.text}
                      onChange={(e) => handleMiniLessonChange(index, e.target.value)}
                    ></textarea>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 ml-2"
                      onClick={() => removeMiniLesson(index)}
                      title="Remove Mini Lesson"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center text-gray-300 hover:text-white mt-2"
                  onClick={addMiniLesson}
                >
                  <FaPencilAlt className="mr-2" /> Add Mini Lesson
                </button>
              </div>
              
              {/* Summary Title */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Summary Title<span className="text-red-500">*</span>:
                </label>
                <textarea
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                  value={summaryTitle}
                  onChange={(e) => setSummaryTitle(e.target.value)}
                  required
                  rows={1}
                />
              </div>

              {/* Summary */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Summary:</label>
                {summary.map((sum, index) => (
                  <div key={index} className="flex items-center mb-2">
                    {/* Static Bullet Point Symbol */}
                    <span className="text-white mr-2">•</span>
                    <textarea
                      ref={(el) => (summaryRefs.current[index] = el)}
                      type="text"
                      placeholder="Summary Text"
                      className="flex-1 p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                      value={sum.text}
                      onChange={(e) =>
                        handleSummaryChange(index, 'text', e.target.value)
                      }
                      rows={1}
                    />
                    <div className="flex space-x-2 ml-2">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeSummary(index)}
                        title="Remove Summary"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-green-500"
                        onClick={() => handleIndent('summary', index)}
                        title="Indent"
                      >
                        &#8679;
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-blue-500"
                        onClick={() => handleUnindent('summary', index)}
                        title="Unindent"
                      >
                        &#8681;
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center text-gray-300 hover:text-white mt-2"
                  onClick={addSummary}
                >
                  <FaPencilAlt className="mr-2" /> Add Summary
                </button>
              </div>

              {/* Next Lesson */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Next Lesson:</label>
                <Select
                  isClearable
                  options={lessons
                    .filter((lesson) => !(selectedLesson && lesson.lessonId === lessonId)) // Exclude self
                    .map((lesson) => ({
                      value: lesson.id,
                      label: lesson.title,
                    }))}
                  value={
                    nextLesson
                      ? {
                          value: nextLesson,
                          label:
                            lessons.find((l) => l.id === nextLesson)?.title ||
                            'Selected Lesson',
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setNextLesson(selectedOption ? selectedOption.value : '')
                  }
                  placeholder="Select next lesson..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#202020',
                      borderColor: '#555',
                      color: 'white',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#202020',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#ffa500' : '#202020',
                      color: 'white',
                      ':hover': {
                        backgroundColor: '#ffa500',
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white',
                    }),
                  }}
                />
              </div>

              {/* Submit and Delete Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  disabled={imageUploading}
                >
                  {isCreatingLesson
                    ? imageUploading
                      ? 'Uploading...'
                      : 'Create Lesson'
                    :imageUploading
                    ? 'Uploading...'
                    : 'Update Lesson'}
                </button>
                {!isCreatingLesson && selectedLesson && (
                  <button
                    type="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 flex items-center"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrashAlt className="mr-2" /> Delete Lesson
                  </button>
                )}
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="text-green-500 mt-2">
                  {isCreatingLesson
                    ? 'Lesson created successfully!'
                    : 'Lesson updated successfully!'}
                </div>
              )}
            </form>
          </div>
        ) : (
          // Prompt to select a lesson or create a new one
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl text-white">
              Select a Lesson for More Details or Create a New One
            </h2>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Image</h2>
                <button
                  onClick={() => setShowImageUploadModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <p>
                  Please select a JPEG image with an aspect ratio close to 1.4 (e.g.,
                  266×190 pixels). The file size should be under 100 KB.
                </p>
                <p>
                  We recommend using an image with similar dimensions to maintain
                  consistency.
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/jpeg"
                id="imageFileInput"
                style={{ display: 'none' }} // Hidden file input
                onChange={handleImageFileUpload} // Handle the image upload
              />

              {/* Buttons for Uploading */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowImageUploadModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    document.getElementById('imageFileInput').click()
                  } // Trigger file input click
                  className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                >
                  <FaUpload className="mr-2" /> Select Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {showImagePreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Preview Image</h2>
                <button
                  onClick={() => setShowImagePreviewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Image Preview */}
              <div className="mb-4 flex justify-center">
                <img
                  src={imagePreviewURL}
                  alt="Preview"
                  className="w-80 h-60 object-cover rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowImagePreviewModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImageUpload} // Function to upload image and update lesson
                  className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                >
                  <FaCheck className="mr-2" /> Confirm and Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-white font-bold">Confirm Delete Lesson</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Warning Message */}
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the lesson "
                <strong>{selectedLesson.title}</strong>"? This action{' '}
                <span className="text-red-500">cannot be reversed</span>.
              </p>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                  onClick={handleDeleteLesson}
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Success Modal */}
        {showDeleteSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-green-500 p-6 rounded-lg">
              <h3 className="text-white text-lg font-bold mb-4">
                Lesson Deleted Successfully!
              </h3>
            </div>
          </div>
        )}

        {/* Duplicate Prompt Modal */}
        {showDuplicatePrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#202020] p-6 rounded-lg">
              <h3 className="text-white text-lg font-bold mb-4">
                Duplicate Patterns Detected
              </h3>
              <p className="text-gray-300 mb-4">
                The following patterns are duplicated: {duplicatesFound.join(', ')}. Do you
                want to keep the duplicates?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDuplicatePrompt(false)}
                >
                  No, Remove Duplicates
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => handleDuplicatePrompt(true)}
                >
                  Yes, Keep Duplicates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manual Patterns Upload</h2>
                <button onClick={handleCloseUploadModal} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Instructions:</p>
                <ul className="list-disc list-inside">
                  <li>Upload your .CSV file containing patterns in the correct format.</li>
                  <li>Make sure each pattern is in its own row within the CSV file.</li>
                  <li>The first column should contain the patterns you want to upload.</li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Important notes:</p>
                <ul className="list-disc list-inside">
                  <li>The uploaded file will replace or append to the current patterns based on your selection.</li>
                  <li>Make sure the CSV file contains valid patterns and is formatted properly.</li>
                </ul>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept=".csv"
                id="csvFileInput"
                style={{ display: 'none' }} // Hidden file input
                onChange={handleFileUpload} // Trigger the upload handler
              />

              {/* Buttons for Uploading */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseUploadModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => document.getElementById('csvFileInput').click()} // Trigger file input click
                  className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                >
                  <FaUpload className="mr-2" /> Upload file
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSV Review Modal */}
        {showSecondModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Review Processed Patterns</h2>
                <button onClick={() => setShowSecondModal(false)} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>

              {/* Processed Patterns */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Patterns:</p>
                <textarea
                  className="w-full h-40 p-2 bg-[#303030] text-white rounded mb-4"
                  value={processedWords.join('\n')}
                  onChange={(e) => setProcessedWords(e.target.value.split('\n'))}
                />
              </div>

              {/* Append or Replace Options */}
              <div className="mb-6">
                <label className="text-white mr-2">Add patterns:</label>
                <label className="text-white mr-2">
                  <input
                    type="radio"
                    value="append"
                    checked={uploadOption === 'append'}
                    onChange={() => setUploadOption('append')}
                    className="mr-1"
                  />
                  After existing patterns
                </label>
                <label className="text-white">
                  <input
                    type="radio"
                    value="replace"
                    checked={uploadOption === 'replace'}
                    onChange={() => setUploadOption('replace')}
                    className="mr-1"
                  />
                  Replace current patterns
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSecondModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUploadedWords}
                  className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] transition-colors duration-200"
                >
                  Add Patterns
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Category Modal */}
        {showNewCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Category</h2>
                <button
                  onClick={() => setShowNewCategoryModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleCreateCategory}>
                {/* Category ID (lessonId) */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Category ID<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    required
                    placeholder="e.g., LanguageBasics"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Description<span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter category description"
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Category Image<span className="text-red-500">*</span>:
                  </label>
                  {/* Display selected image preview if available */}
                  {newCategoryImageURL && (
                    <div className="mb-2">
                      <img
                        src={newCategoryImageURL}
                        alt="Category Preview"
                        className="w-64 h-auto object-cover rounded"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                    onClick={() => document.getElementById('newCategoryImageInput').click()}
                  >
                    <FaUpload className="mr-2" /> {newCategoryImageURL ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input
                    type="file"
                    accept="image/jpeg"
                    id="newCategoryImageInput"
                    style={{ display: 'none' }}
                    onChange={handleNewCategoryImageUpload}
                  />
                </div>

                {/* Time Field */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Time<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={newCategoryTime}
                    onChange={(e) => setNewCategoryTime(e.target.value)}
                    required
                    placeholder="e.g., 30 minutes"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <FaCheck className="mr-2" /> Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Additional Modals and Components can be added here */}
    </div>
  );
};

export default LessonManagement;
