// Hive.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'; // Firestore functions
import { db, storage } from './firebaseConfig'; // Firebase config (ensure storage is exported)
import {
  FaTrashAlt,
  FaUpload,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'; // Firebase Storage functions
import Select from 'react-select';

import { getAuth } from 'firebase/auth';

const Hive = () => {
  // Define the collection map
  const collectionMap = {
    Announcement: 'announcements',
    Article: 'articles',
    WOTD: 'wotd',
  };

  const auth = getAuth(); // Initialize Auth
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);
  
  // State variables
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Selected post
  const [isCreatingPost, setIsCreatingPost] = useState(false); // Creating a new post

  // Form state variables for creating/editing posts
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState(''); // 'Announcement', 'Article', 'WOTD'
  const [category, setCategory] = useState(''); // For Articles
  const [subDetails, setSubDetails] = useState(''); // For Announcements (replacing description)
  const [word, setWord] = useState(''); // For WOTD (wordName)
  const [meaning, setMeaning] = useState(''); // For WOTD (read-only)
  const [exampleSentence, setExampleSentence] = useState(''); // For WOTD (read-only)
  const [partOfSpeech, setPartOfSpeech] = useState(''); // For WOTD (read-only)
  const [wordActualDate, setWordActualDate] = useState(''); // For WOTD (editable)

  const [userGroups, setUserGroups] = useState([]);
  const [selectedUserGroupsOptions, setSelectedUserGroupsOptions] = useState([]);
  const [allUserGroups, setAllUserGroups] = useState([]); // All user groups from Firestore

  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // New State Variables for Article Content
  const [introduction, setIntroduction] = useState(''); // Introduction text
  const [conclusion, setConclusion] = useState(''); // Conclusion text

  // States for handling image upload modals
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(null);

  // States for handling delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // State for success messages
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // State for filter control
  const [filterType, setFilterType] = useState('All'); // 'All', 'Announcement', 'Article', 'WOTD'

  // State for loading word info in WOTD
  const [isLoadingWordInfo, setIsLoadingWordInfo] = useState(false);

  // Refs for auto-resizing textareas
  const subDetailsRef = useRef(null);

  // New State Variable for Dynamic Sections
  const [sections, setSections] = useState([]);

  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.section-dropdown')) {
        setShowSectionDropdown(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Fetch all user groups from Firestore
  useEffect(() => {
    const fetchUserGroups = async () => {
      const userGroupsCollection = collection(db, 'UserGroups');
      try {
        const userGroupsSnapshot = await getDocs(userGroupsCollection);
        const userGroupsList = userGroupsSnapshot.docs.map((doc) => doc.id);
        setAllUserGroups(userGroupsList);
        console.log('Fetched user groups:', userGroupsList);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

  // Fetch all posts from Firestore on mount or when filterType changes
  useEffect(() => {
    const fetchPosts = async () => {
      let combinedPosts = [];

      try {
        if (filterType === 'Announcement' || filterType === 'All') {
          const announcementsCollection = collection(db, collectionMap['Announcement']);
          const snapshot = await getDocs(announcementsCollection);
          const announcements = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: 'Announcement',
          }));
          combinedPosts = [...combinedPosts, ...announcements];
          console.log(`Fetched ${announcements.length} Announcements.`);
        }

        if (filterType === 'Article' || filterType === 'All') {
          const articlesCollection = collection(db, collectionMap['Article']);
          const snapshot = await getDocs(articlesCollection);
          const articles = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: 'Article',
          }));
          combinedPosts = [...combinedPosts, ...articles];
          console.log(`Fetched ${articles.length} Articles.`);
        }

        if (filterType === 'WOTD' || filterType === 'All') {
          const wotdCollection = collection(db, collectionMap['WOTD']);
          const snapshot = await getDocs(wotdCollection);
          const wotds = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: 'WOTD',
          }));
          combinedPosts = [...combinedPosts, ...wotds];
          console.log(`Fetched ${wotds.length} WOTDs.`);
        }

        // Sort combinedPosts by uploadDate descending
        combinedPosts.sort((a, b) => {
          const dateA = a.uploadDate.toDate ? a.uploadDate.toDate() : new Date(a.uploadDate);
          const dateB = b.uploadDate.toDate ? b.uploadDate.toDate() : new Date(b.uploadDate);
          return dateB - dateA;
        });

        setPosts(combinedPosts);
        console.log('Combined and sorted posts:', combinedPosts);

        // For WOTD posts, fetch word information from JSON collection
        combinedPosts
          .filter((post) => post.type === 'WOTD')
          .forEach((wotdPost) => {
            fetchWordInfo(wotdPost.wordName, wotdPost.id);
          });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [filterType]);

  // Auto-resize textareas whenever their content changes
  useEffect(() => {
    const autoResizeTextarea = (textarea) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    // Resize subDetails
    if (subDetailsRef.current) {
      autoResizeTextarea(subDetailsRef.current);
    }
  }, [subDetails]);

  // Fetch word info from JSON collection for WOTD
  const fetchWordInfo = async (wordName, postId) => {
    console.log(`Fetching word info for: "${wordName}", Post ID: ${postId}`);
    try {
      const wordDoc = await getDoc(doc(db, 'JSON', wordName.trim()));
      if (wordDoc.exists()) {
        const data = wordDoc.data();

        // Update the specific post with word information
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                meaning: data.shortDefinition || '',
                exampleSentence: data.exampleSentence || '',
                partOfSpeech: data.partOfSpeech || '',
              };
            }
            return post;
          })
        );

        // Also update the form fields if the edited post is the current one
        if (selectedPost && selectedPost.id === postId && !isCreatingPost) {
          setMeaning(data.shortDefinition || '');
          setExampleSentence(data.exampleSentence || '');
          setPartOfSpeech(data.partOfSpeech || '');
          console.log('Updated word information in form.');
        }
      } else {
        console.warn(`Word "${wordName}" not found in JSON collection.`);
      }
    } catch (error) {
      console.error('Error fetching word info:', error);
    }
  };

  // Handle "Add Post" button click
  const handleAddPostClick = () => {
    console.log('Add Post button clicked.');
    setIsCreatingPost(true);
    setSelectedPost(null);
    // Reset form fields
    resetForm();
  };

  // Handle post card click
  const handleCardClick = (post) => {
    console.log('Post card clicked:', post);
    setSelectedPost(post);
    setIsCreatingPost(false);
    // Populate form fields with selected post data
    populateForm(post);
  };

  // Reset form fields
  const resetForm = () => {
    console.log('Resetting form fields.');
    setPostId('');
    setTitle('');
    setType('');
    setCategory('');
    setSubDetails('');
    setWord('');
    setMeaning('');
    setExampleSentence('');
    setPartOfSpeech('');
    setWordActualDate('');
    setUserGroups([]);
    setSelectedUserGroupsOptions([]);
    setImageUrl('');
    setImageFile(null);
    setIntroduction('');
    setConclusion('');
    setIsLoadingWordInfo(false);
  };

  

  // Helper function to add a section
  // Helper function to add a section
  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: type === 'image' ? '' : '' };
    setSections([...sections, newSection]);
    console.log(`Added a new ${type} section.`);
  };


  // Handle userGroups using react-select
  const handleUserGroupsChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === 'select_all')) {
      setUserGroups(allUserGroups);
      setSelectedUserGroupsOptions([{ value: 'select_all', label: 'Select All' }]);
      console.log('All user groups selected.');
    } else {
      setUserGroups(selectedOptions.map((option) => option.value));
      setSelectedUserGroupsOptions(selectedOptions);
      console.log('Selected user groups:', selectedOptions.map((option) => option.value));
    }
  };

  // Handle image file selection (Only for Articles)
  const handleImageFileUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setImagePreviewURL(url);
      setShowImagePreviewModal(true);
      console.log('Image file selected:', e.target.files[0]);
    }
  };

  // Upload image to Firebase Storage and get URL
  const uploadImage = async () => {
    if (!imageFile) return imageUrl || '';
    setImageUploading(true);
    const fileName = `${Date.now()}_${imageFile.name}`;
    const storageReference = storageRef(storage, `postImages/${fileName}`);
    try {
      await uploadBytes(storageReference, imageFile);
      const url = await getDownloadURL(storageReference);
      setImageUrl(url);
      setImageUploading(false);
      console.log('Image uploaded successfully:', url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploading(false);
      return '';
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
      console.log('Image validation failed: Size exceeds limit.');
      return;
    }

    if (file.type !== 'image/jpeg') {
      alert('Only JPEG images are allowed.');
      console.log('Image validation failed: Incorrect file type.');
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
        console.log('Image validation failed: Incorrect aspect ratio.');
        return;
      }

      // Upload image
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        // Close both modals
        setShowImagePreviewModal(false);
        setShowImageUploadModal(false);
        console.log('Image upload confirmed and modals closed.');
      } else {
        alert('Image upload failed.');
        console.log('Image upload failed during confirmation.');
      }
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission initiated.');

    // Basic validation
    if (!postId || (isCreatingPost && !type)) {
      alert('Please fill in all required fields.');
      console.log('Validation failed: Missing postId or type.');
      return;
    }

    // Ensure postId is unique when creating or changing
    if (isCreatingPost || (selectedPost && postId !== selectedPost.id)) {
      const collectionName = isCreatingPost ? collectionMap[type] : collectionMap[selectedPost.type];
      const existingPostDoc = await getDoc(doc(db, collectionName, postId));
      if (existingPostDoc.exists()) {
        alert('A post with this ID already exists. Please choose a different ID.');
        console.log('Post ID conflict detected.');
        return;
      }
    }

    // Upload image and get URL (Only for Articles)
    let uploadedImageUrl = imageUrl;
    if (type === 'Article' && imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        alert('Image upload failed.');
        console.log('Image upload failed during form submission.');
        return;
      }
    }

    // Prepare userGroups
    const processedUserGroups = userGroups.filter((group) => group.trim() !== '');

    // Prepare post data based on type
    let postData = {
      userGroups: processedUserGroups,
      uploadDate: Timestamp.now(),
    };

    if (type === 'Article') {
      postData = {
        ...postData,
        name: title,
        category,
        introduction,
        sections, // Include sections array
        conclusion,
        imageUrl: uploadedImageUrl || null,
      };
    } else if (type === 'Announcement') {
      postData = {
        ...postData,
        name: title,
        subDetails,likes: 0, // Initialize likes to 0
        announcementId: postId, // Store Post ID
        userId: currentUser ? currentUser.uid : null, 
      };
      if (!currentUser) {
        alert('User not authenticated. Please log in to create an announcement.');
        console.log('User authentication missing.');
        return;
      }
    } else if (type === 'WOTD') {
      // Parse the selected date and set the time to 1 AM EST (which is 6 AM UTC)
      if (!wordActualDate) {
        alert('Please select the Actual Word Date.');
        console.log('Validation failed: Missing wordActualDate.');
        return;
      }

      const [year, month, day] = wordActualDate.split('-').map(Number);
      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        year < 1970 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        alert('Invalid date format for Actual Word Date.');
        console.log('Validation failed: Invalid wordActualDate.');
        return;
      }

      // Set time to 1 AM EST (UTC-5) -> 6 AM UTC
      const utcDate = new Date(Date.UTC(year, month - 1, day, 6, 0, 0));

      // Validate the date
      if (isNaN(utcDate.getTime())) {
        alert('Invalid date for Actual Word Date.');
        console.log('Validation failed: wordActualDate is invalid.');
        return;
      }

      postData = {
        ...postData,
        wordName: word, // Use the 'word' state as 'wordName'
        wordActualDate: Timestamp.fromDate(utcDate),
      };
    }

    console.log('Prepared postData:', postData);

    try {
      const collectionName = isCreatingPost ? collectionMap[type] : collectionMap[selectedPost.type];

      if (isCreatingPost) {
        // Create a new post in the respective Firestore collection
        await setDoc(doc(db, collectionName, postId), postData);
        console.log('Post created successfully.');

        // Update the posts array
        setPosts((prevPosts) => {
          const updatedPosts = [
            ...prevPosts,
            { id: postId, ...postData, type },
          ];
          // Sort the updated posts array
          updatedPosts.sort((a, b) => b.uploadDate.seconds - a.uploadDate.seconds);
          console.log('Posts state updated after creation:', updatedPosts);
          return updatedPosts;
        });

        // If WOTD, fetch word info
        if (type === 'WOTD') {
          fetchWordInfo(word, postId);
        }

        // Set the selected post to the newly created post
        const newPost = { id: postId, ...postData, type };
        setSelectedPost(newPost);
        console.log('Selected post set to newly created post.');

        // Populate the form with the new post's data
        populateForm(newPost);

        setIsCreatingPost(false);

        // Show the success modal
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        console.log('Success message displayed.');
      } else if (selectedPost) {
        const collectionName = collectionMap[selectedPost.type];
        if (postId !== selectedPost.id) {
          // Changing postId: create new document, copy data, delete old document
          // Check if new postId already exists
          const newPostDoc = await getDoc(doc(db, collectionName, postId));
          if (newPostDoc.exists()) {
            alert('A post with the new ID already exists. Please choose a different ID.');
            console.log('Post ID conflict detected during update.');
            return;
          }

          // Create new document with new postId
          await setDoc(doc(db, collectionName, postId), postData);
          console.log('New post created with new ID.');

          // Delete old document
          await deleteDoc(doc(db, collectionName, selectedPost.id));
          console.log('Old post deleted.');

          // Update the posts array
          setPosts((prevPosts) =>
            prevPosts
              .filter((post) => post.id !== selectedPost.id)
              .concat({ id: postId, ...postData, type: selectedPost.type })
              .sort((a, b) => b.uploadDate.seconds - a.uploadDate.seconds)
          );
          console.log('Posts state updated after changing postId.');

          // If WOTD, fetch word info
          if (selectedPost.type === 'WOTD') {
            fetchWordInfo(word, postId);
          }

          // Update the selected post
          const newPost = { id: postId, ...postData, type: selectedPost.type };
          setSelectedPost(newPost);
          console.log('Selected post updated to new post.');

          // Populate the form with the new post's data
          populateForm(newPost);

          setIsCreatingPost(false);

          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
          console.log('Success message displayed after postId change.');
        } else {

          let updatedPostData = postData;
          if (selectedPost.type === 'Announcement') {
            // Preserve likes and userId
            updatedPostData.likes = selectedPost.likes || 0;
            updatedPostData.announcementId = selectedPost.announcementId || postId;
            updatedPostData.userId = selectedPost.userId || (currentUser ? currentUser.uid : null);
          }

          // If postId hasn't changed, just update the existing document
          await updateDoc(doc(db, collectionName, postId), updatedPostData);
          console.log('Post updated successfully.');

          // Update the posts array
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId ? { id: postId, ...updatedPostData, type: post.type } : post
            )
          );
          console.log('Posts state updated after update.');

          // If WOTD, fetch word info
          if (selectedPost.type === 'WOTD') {
            fetchWordInfo(word, postId);
          }

          // Update the selected post
          const updatedPost = { id: postId, ...updatedPostData, type: selectedPost.type };
          setSelectedPost(updatedPost);
          console.log('Selected post updated.');

          // Populate the form with the updated post's data
          populateForm(updatedPost);

          // Show the success modal
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
          console.log('Success message displayed after update.');
        }
      }

      // Reset form after submission if creating a new post
      if (isCreatingPost) {
        resetForm();
        console.log('Form reset after creating a new post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert(`Error submitting post: ${error.message}`);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async () => {
    if (!selectedPost) return;

    console.log('Initiating deletion for post:', selectedPost);

    try {
      // Delete the post document
      await deleteDoc(doc(db, collectionMap[selectedPost.type], selectedPost.id));
      console.log('Post deleted successfully.');
      alert('Post deleted successfully!');

      // Refresh posts list by removing the deleted post
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== selectedPost.id)
      );
      console.log('Posts state updated after deletion.');

      // Reset states
      resetForm();
      setSelectedPost(null);
      setIsCreatingPost(false);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      setTimeout(() => setShowDeleteSuccessModal(false), 3000);
      console.log('Delete success modal displayed.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`Error deleting post: ${error.message}`);
    }
  };

  // Handler to update section content
  const handleSectionChange = (id, value) => {
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, content: value } : section
    );
    setSections(updatedSections);
    console.log(`Updated section ${id} content.`);
  };

  // Handler to remove a section by id
  const handleRemoveSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
    console.log(`Removed section ${id}.`);
  };

  // Handler to upload image for a section
  const handleImageSectionUpload = async (id, file) => {
    if (!file) return;

    // Validate image (similar to main image validation)
    const maxSizeInBytes = 100 * 1024; // 100 KB
    if (file.size > maxSizeInBytes) {
      alert('Image size exceeds 100 KB. Please choose a smaller image.');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG images are allowed.');
      return;
    }

    // Optional: Check aspect ratio or other validations here

    // Upload image to Firebase Storage
    const fileName = `sectionImages/${Date.now()}_${file.name}`;
    const storageReference = storageRef(storage, fileName);
    try {
      await uploadBytes(storageReference, file);
      const url = await getDownloadURL(storageReference);

      // Update the section with the image URL
      const updatedSections = sections.map((section) =>
        section.id === id ? { ...section, content: url } : section
      );
      setSections(updatedSections);
      console.log(`Uploaded image for section ${id}: ${url}`);
    } catch (error) {
      console.error('Error uploading section image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const populateForm = (post) => {
    console.log('Populating form with post:', post);
    setPostId(post.id || '');
    if (post.type === 'Article') {
      setTitle(post.name || '');
      setIntroduction(post.introduction || '');
      setSections(post.sections || []); // Load sections
      setConclusion(post.conclusion || '');
    } else if (post.type === 'WOTD') {
      setWord(post.wordName || '');
    } else if (post.type === 'Announcement') {
      setTitle(post.name || '');
      setSubDetails(post.subDetails || '');
    }
    setType(post.type || '');
    setCategory(post.category || '');
    setWord(post.wordName || '');
    setMeaning(post.meaning || '');
    setExampleSentence(post.exampleSentence || '');
    setPartOfSpeech(post.partOfSpeech || '');
    setWordActualDate(
      post.wordActualDate && post.wordActualDate.toDate
        ? post.wordActualDate.toDate().toISOString().split('T')[0]
        : post.wordActualDate || ''
    );
    setUserGroups(post.userGroups || []);
    setSelectedUserGroupsOptions(
      post.userGroups.map((group) => ({ value: group, label: group }))
    );
    setImageUrl(post.imageUrl || '');
    setImageFile(null);
    setIntroduction(post.introduction || '');
    setSections(post.sections || []); // Ensure sections are loaded
    setConclusion(post.conclusion || '');
    setIsLoadingWordInfo(false);
  
    // If the post is WOTD, fetch word information
    if (post.type === 'WOTD' && post.wordName) {
      fetchWordInfo(post.wordName, post.id);
    }
  };  


  // Helper function to determine if a color is dark based on hex
  const isDarkColor = (hex) => {
    if (!hex) return true;
    let hexSanitized = hex.replace('#', '');
    if (hexSanitized.length === 3) {
      hexSanitized = hexSanitized
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const bigint = parseInt(hexSanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section - Scrollable List */}
      <div className="left-section w-1/3 overflow-y-auto h-full p-4 bg-[#1a1a1a]">
        {/* Filter Control */}
        <div className="mb-4">
          <Select
            options={[
              { value: 'All', label: 'All' },
              { value: 'Announcement', label: 'Announcements' },
              { value: 'Article', label: 'Articles' },
              { value: 'WOTD', label: 'Words of the Day' },
            ]}
            value={{
              value: filterType,
              label: filterType === 'WOTD' ? 'Words of the Day' : filterType,
            }}
            onChange={(selectedOption) => setFilterType(selectedOption.value)}
            placeholder="Filter by type..."
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

        {/* Add Post Card */}
        <div
          className={`bg-[#202020] p-4 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer ${
            isCreatingPost
              ? 'brightness-150'
              : 'brightness-100 hover:brightness-125'
          }`}
          style={{ transition: '0.3s ease' }}
          onClick={handleAddPostClick}
        >
          <h2 className="text-xl text-white font-bold text-center">Add Post</h2>
        </div>

        {/* Posts List */}
        {posts.length > 0 ? (
          posts
            .filter((post) => filterType === 'All' || post.type === filterType)
            .map((post) => (
              <div
                key={post.id}
                className={`bg-[#202020] p-4 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer ${
                  selectedPost?.id === post.id
                    ? 'brightness-150'
                    : 'brightness-100 hover:brightness-125'
                }`}
                style={{ transition: '0.3s ease' }}
                onClick={() => handleCardClick(post)}
              >
                {/* Conditionally render image only for Articles */}
                {post.type === 'Article' && (
                  <div
                    className="relative w-full"
                    style={{ paddingTop: '71.16%' /* (190/266)*100% ≈ 71.16% */ }}
                  >
                    <img
                      src={
                        post.imageUrl ||
                        'https://via.placeholder.com/266x190.png?text=No+Image'
                      }
                      alt={
                        post.type === 'Article'
                          ? post.name
                          : post.type === 'Announcement'
                          ? post.name
                          : post.wordName || 'No Title'
                      }
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                {/* Post Details */}
                <h2 className="text-xl text-white font-bold mt-4 mb-2">
                  {post.type === 'Article'
                    ? post.name
                    : post.type === 'Announcement'
                    ? post.name
                    : post.wordName}
                </h2>
                <p className="text-gray-400 mb-3">Type: {post.type}</p>
                {/* Additional fields based on type */}
                {post.type === 'Article' && post.category && (
                  <p className="text-gray-400 mb-3">Category: {post.category}</p>
                )}
                {post.type === 'Article' && post.introduction && (
                  <p className="text-gray-300 mb-3">
                    {post.introduction.length > 100
                      ? `${post.introduction.substring(0, 100)}...`
                      : post.introduction}
                  </p>
                )}
                {post.type === 'WOTD' && post.wordActualDate && (
                  <p className="text-gray-400 mb-3">
                    Actual Word Date: {post.wordActualDate.toDate().toLocaleDateString()}
                  </p>
                )}
                {/* User Groups */}
                <div className="flex flex-wrap">
                  {post.userGroups && post.userGroups.length > 0 ? (
                    post.userGroups.map((group, index) => (
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
          <p className="text-white">No posts available.</p>
        )}
      </div>

      {/* Right Section - Detailed Info or Create/Edit Post Form */}
      <div className="right-section w-2/3 p-4 rounded-lg ml-4 h-full overflow-y-auto bg-[#1a1a1a]">
        {isCreatingPost || selectedPost ? (
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">
              {isCreatingPost
                ? 'Create New Post'
                : `Edit ${
                    selectedPost.type === 'Article'
                      ? 'Article'
                      : selectedPost.type === 'Announcement'
                      ? 'Announcement'
                      : 'Word of the Day'
                  }: ${
                    selectedPost.type === 'Article'
                      ? selectedPost.name
                      : selectedPost.type === 'Announcement'
                      ? selectedPost.name
                      : selectedPost.wordName
                  }`}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Post ID */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Post ID<span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                  value={postId}
                  onChange={(e) => setPostId(e.target.value)}
                  required
                  placeholder="e.g., Post123"
                />
              </div>

              {/* Type - Only visible when creating a post */}
              {isCreatingPost && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Type<span className="text-red-500">*</span>:
                  </label>
                  <select
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Article">Article</option>
                    <option value="WOTD">Word of the Day</option>
                  </select>
                </div>
              )}

              {/* Name Field for Announcements and Articles */}
              {(isCreatingPost && type !== 'WOTD') ||
              (!isCreatingPost && selectedPost && selectedPost.type !== 'WOTD') ? (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    {type === 'Article' ? 'Name' : 'Name'}
                    <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter name"
                  />
                </div>
              ) : null}

              {/* Introduction (for Article) */}
              {(type === 'Article' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Article')) && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Introduction<span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    required
                    rows={4}
                    placeholder="Enter introduction"
                  ></textarea>
                </div>
              )}

              {/* Render Dynamic Sections */}
              {sections.map((section, index) => (
                <div key={section.id} className="mb-4 border p-4 rounded-lg bg-[#333333]">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg text-white capitalize">{section.type}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveSection(section.id)}
                      title="Remove Section"
                    >
                      &times;
                    </button>
                  </div>
                  
                  {/* Render input fields based on section type */}
                  {section.type === 'paragraph' && (
                    <textarea
                      className="w-full p-2 rounded bg-[#444444] text-white focus:outline-none resize-none"
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      required
                      rows={3}
                      placeholder="Enter paragraph"
                    ></textarea>
                  )}
                  
                  {section.type === 'bullet' && (
                    <textarea
                      className="w-full p-2 rounded bg-[#444444] text-white focus:outline-none resize-none"
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      required
                      rows={3}
                      placeholder="Enter bullet points (one per line)"
                    ></textarea>
                  )}
                  
                  {section.type === 'header' && (
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-[#444444] text-white focus:outline-none"
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      required
                      placeholder="Enter header text"
                    />
                  )}
                  
                  {section.type === 'image' && (
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => handleImageSectionUpload(section.id, e.target.files[0])}
                      />
                      {section.content && (
                        <img
                          src={section.content}
                          alt="Section"
                          className="ml-4 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Section Dropdown Button */}
              {(type === 'Article' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Article')) && (
                <div className="mb-4 w-full section-dropdown">
                  <div className="relative inline-block text-left w-full">
                    <button
                      type="button"
                      className="bg-[#202020] text-white px-6 py-4 rounded-lg border border-[#ffa500] w-full text-left flex justify-between items-center hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffa500]"
                      onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                    >
                      <span>+ Add Section</span>
                      <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {showSectionDropdown && (
                      <div className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-[#202020] ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <button
                            onClick={() => { addSection('paragraph'); setShowSectionDropdown(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffa500] hover:text-black"
                            role="menuitem"
                          >
                            Paragraph
                          </button>
                          <button
                            onClick={() => { addSection('bullet'); setShowSectionDropdown(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffa500] hover:text-black"
                            role="menuitem"
                          >
                            Bullet Points
                          </button>
                          <button
                            onClick={() => { addSection('header'); setShowSectionDropdown(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffa500] hover:text-black"
                            role="menuitem"
                          >
                            Header
                          </button>
                          <button
                            onClick={() => { addSection('image'); setShowSectionDropdown(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffa500] hover:text-black"
                            role="menuitem"
                          >
                            Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conclusion (for Article) */}
              {(type === 'Article' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Article')) && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Conclusion<span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    required
                    rows={4}
                    placeholder="Enter conclusion"
                  ></textarea>
                </div>
              )}

              {/* Word Field - Only visible when creating or editing WOTD */}
              {(type === 'WOTD' || (!isCreatingPost && selectedPost && selectedPost.type === 'WOTD')) && (
                <div className="mb-4 flex items-center">
                  {/* Loading Indicator */}
                  {isLoadingWordInfo && (
                    <div className="ml-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Word Field - Only visible when editing WOTD */}
              {!isCreatingPost && selectedPost && selectedPost.type === 'WOTD' && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Word<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    required
                    placeholder="Enter word"
                  />
                </div>
              )}

              {/* Category (for Article) */}
              {(type === 'Article' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Article')) && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Category<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="e.g., Technology"
                  />
                </div>
              )}

              {/* Sub Details (for Announcement) */}
              {(type === 'Announcement' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Announcement')) && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Sub Details<span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    ref={subDetailsRef}
                    className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                    value={subDetails}
                    onChange={(e) => setSubDetails(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter announcement sub details"
                  ></textarea>
                </div>
              )}

              {/* Word Information (for WOTD) */}
              {(type === 'WOTD' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'WOTD')) && (
                <>
                  {/* Meaning - Read-only */}
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                      Meaning<span className="text-red-500">*</span>:
                    </label>
                    <textarea
                      className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                      value={meaning}
                      readOnly
                      rows={2}
                      placeholder="Meaning of the word"
                    ></textarea>
                  </div>
                  {/* Example Sentence - Read-only */}
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                      Example Sentence:
                    </label>
                    <textarea
                      className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none resize-none overflow-hidden"
                      value={exampleSentence}
                      readOnly
                      rows={2}
                      placeholder="Example sentence"
                    ></textarea>
                  </div>
                  {/* Part of Speech - Read-only */}
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                      Part of Speech:
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                      value={partOfSpeech}
                      readOnly
                      placeholder="e.g., Noun"
                    />
                  </div>
                  {/* Actual Word Date - Editable */}
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                      Actual Word Date<span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 rounded bg-[#333333] text-white focus:outline-none"
                      value={wordActualDate}
                      onChange={(e) => setWordActualDate(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

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

              {/* Image Upload for Articles Only */}
              {(type === 'Article' ||
                (!isCreatingPost && selectedPost && selectedPost.type === 'Article')) && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Image:
                  </label>
                  {/* Display Current Image if Available */}
                  {imageUrl && (
                    <div className="mb-2">
                      <img
                        src={imageUrl}
                        alt="Post"
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
              )}

              {/* Submit and Delete Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  disabled={imageUploading || (type === 'WOTD' && isLoadingWordInfo)}
                >
                  {isCreatingPost
                    ? imageUploading
                      ? 'Uploading...'
                      : 'Create Post'
                    : imageUploading
                    ? 'Uploading...'
                    : 'Update Post'}
                </button>
                {!isCreatingPost && selectedPost && (
                  <button
                    type="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 flex items-center"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrashAlt className="mr-2" /> Delete Post
                  </button>
                )}
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="text-green-500 mt-2">
                  {isCreatingPost
                    ? 'Post created successfully!'
                    : 'Post updated successfully!'}
                </div>
              )}
            </form>
          </div>
        ) : (
          // Prompt to select a post or create a new one
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl text-white">
              Select a Post for More Details or Create a New One
            </h2>
          </div>
        )}

        {/* Image Upload Modal (Articles Only) */}
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
                  onClick={() => document.getElementById('imageFileInput').click()} // Trigger file input click
                  className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] flex items-center"
                >
                  <FaUpload className="mr-2" /> Select Image
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Image Preview Modal (Articles Only) */}
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
                  onClick={handleConfirmImageUpload} // Function to upload image and update post
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
                <h3 className="text-xl text-white font-bold">Confirm Delete Post</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Warning Message */}
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the post "
                <strong>
                  {selectedPost.type === 'Article'
                    ? selectedPost.name
                    : selectedPost.type === 'Announcement'
                    ? selectedPost.name
                    : selectedPost.wordName}
                </strong>
                "? This action <span className="text-red-500">cannot be reversed</span>.
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
                  onClick={handleDeletePost}
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
                Post Deleted Successfully!
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hive;
