import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'; // Firestore functions
import { db, storage } from './firebaseConfig'; // Firebase config
import { FaUpload, FaDownload, FaPencilAlt, FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaImage } from 'react-icons/fa';

import Select from 'react-select';
import Papa from 'papaparse';


const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Selected quiz
  const [loading, setLoading] = useState(true); // Loading state
  const [isEditingName, setIsEditingName] = useState(false); // Editing quiz name
  const [isEditingGroups, setIsEditingGroups] = useState(false); // Editing user groups
  const [updatedQuizName, setUpdatedQuizName] = useState(''); // Updated quiz name
  const [editingWordIndex, setEditingWordIndex] = useState(null); // Index of the word being edited
  const [newWord, setNewWord] = useState(''); // New word to be added
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success message
  const [showDuplicatePrompt, setShowDuplicatePrompt] = useState(false);
const [duplicatesFound, setDuplicatesFound] = useState([]);
const [allUserGroups, setAllUserGroups] = useState([]); // All user groups from Firestore
  const [selectedUserGroups, setSelectedUserGroups] = useState([]); // User groups selected in the dropdown

  const [showUploadModal, setShowUploadModal] = useState(false);
const [uploadedWords, setUploadedWords] = useState('');
const [uploadOption, setUploadOption] = useState('append'); // 'append' or 'replace'

const [showSecondModal, setShowSecondModal] = useState(false); // State for the second modal
const [processedWords, setProcessedWords] = useState([]); // State for holding processed words

const [showImageUploadModal, setShowImageUploadModal] = useState(false);
const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
const [selectedImageFile, setSelectedImageFile] = useState(null);
const [imagePreviewURL, setImagePreviewURL] = useState(null);

const [showImageSuccessMessage, setShowImageSuccessMessage] = useState(false);

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
  

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizCollection = collection(db, 'Quiz');
      try {
        const quizSnapshot = await getDocs(quizCollection);
        let quizList = quizSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Sort the quizzes alphabetically by quizName
        quizList.sort((a, b) => a.quizName.localeCompare(b.quizName));
  
        setQuizzes(quizList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };
  
    fetchQuizzes();
  }, []);
  

  // Handle quiz card click
  const handleCardClick = (quiz) => {
    setSelectedQuiz(quiz);
    setUpdatedQuizName(quiz.quizName);
    setSelectedUserGroups(quiz.userGroups || []); // Initialize selectedUserGroups
    setEditingWordIndex(null); // Reset editing index when selecting a new quiz
  };
  
  

  const addEmptyWord = () => {
    setSelectedQuiz((prevQuiz) => {
      const newWords = [...prevQuiz.words, ''];
      setEditingWordIndex(newWords.length - 1); // Set to the index of the new word
      return { ...prevQuiz, words: newWords };
    });
  };
  
  const handleImageFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (e.g., allow up to 100 KB)
      const maxSizeInBytes = 100 * 1024; // 100 KB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds 100 KB. Please select a smaller image.');
        return;
      }
  
      // Only accept JPEG images
      if (file.type !== 'image/jpeg') {
        alert('Please upload a JPEG image.');
        return;
      }
  
      // Create a URL for the selected image to preview it
      const imageUrl = URL.createObjectURL(file);
  
      // Create an Image object to check dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
  
        const aspectRatio = width / height;
        const desiredAspectRatio = 266 / 190; // Approximately 1.4
        const aspectRatioDeviation = Math.abs((aspectRatio - desiredAspectRatio) / desiredAspectRatio);
  
        // Allow a deviation of up to 5%
        const maxDeviation = 0.12; // 5%
  
        if (aspectRatioDeviation > maxDeviation) {
          alert('Image aspect ratio must be approximately 1.4 (e.g., 266×190 pixels). Please select an image with the correct aspect ratio.');
          return;
        }
  
        // If aspect ratio is acceptable, proceed
        setSelectedImageFile(file);
        setImagePreviewURL(imageUrl);
        setShowImageUploadModal(false); // Close the first modal
        setShowImagePreviewModal(true); // Open the second modal
      };
      img.src = imageUrl;
    }
  };  
  
  const handleImageUpload = async () => {
    if (selectedImageFile && selectedQuiz) {
      try {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `quiz_images/${selectedQuiz.id}.jpg`);
  
        await uploadBytes(storageRef, selectedImageFile);
  
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
  
        // Update the quiz's image field in Firestore
        const quizDocRef = doc(db, 'Quiz', selectedQuiz.id);
        await updateDoc(quizDocRef, {
          image: downloadURL,
        });
  
        // Update local state: selectedQuiz
        setSelectedQuiz((prevQuiz) => ({
          ...prevQuiz,
          image: downloadURL,
        }));
  
        // Update the quizzes array to reflect the new image
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === selectedQuiz.id ? { ...quiz, image: downloadURL } : quiz
          )
        );
  
        setShowImagePreviewModal(false);
  
        // Show the success message
        setShowImageSuccessMessage(true);
        // Hide the success message after 3 seconds
        setTimeout(() => setShowImageSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };  

  // Update quiz details in Firestore
  const updateQuizDetails = async () => {
    if (!selectedQuiz) return;
  
    const updatedData = {
      quizName: updatedQuizName,
      userGroups: selectedUserGroups,
      words: selectedQuiz.words, // Keep words updated
      numberOfWords: selectedQuiz.words.length, // Update word count
    };
  
    try {
      // Check if the quiz name has changed
      if (updatedQuizName !== selectedQuiz.quizName) {
        // Store the old quiz ID
        const oldQuizId = selectedQuiz.id;
  
        // Exclude 'id' and 'quizName' from the data to avoid conflicts
        const { id: oldId, quizName: oldQuizName, ...quizDataWithoutIdAndName } = selectedQuiz;
  
        // Create a new document with the updated quiz name
        const newDocRef = doc(db, 'Quiz', updatedQuizName);
        await setDoc(newDocRef, {
          ...quizDataWithoutIdAndName,
          ...updatedData,
          // Do not include 'id' in the document data
        });
  
        // Delete the old document using the old ID
        const oldDocRef = doc(db, 'Quiz', oldQuizId);
  
        // Add error handling for the delete operation
        try {
          await deleteDoc(oldDocRef);
          console.log(`Old quiz '${oldQuizId}' deleted successfully.`);
        } catch (deleteError) {
          console.error(`Error deleting old quiz '${oldQuizId}':`, deleteError);
        }
  
        // Update the local quizzes state
        setQuizzes((prevQuizzes) =>
          prevQuizzes
            .filter((quiz) => quiz.id !== oldQuizId) // Remove the old quiz
            .concat({ ...selectedQuiz, ...updatedData, id: updatedQuizName }) // Add the new quiz
        );
  
        // Update the selected quiz with the new ID
        setSelectedQuiz({ ...selectedQuiz, ...updatedData, id: updatedQuizName });
      } else {
        // If the quiz name hasn't changed, just update the existing document
        const quizDocRef = doc(db, 'Quiz', selectedQuiz.id);
        await updateDoc(quizDocRef, updatedData);
  
        setSelectedQuiz((prevQuiz) => ({
          ...prevQuiz,
          ...updatedData,
        }));
      }
  
      // Reset editing states
      setIsEditingName(false);
      setIsEditingGroups(false);
      setEditingWordIndex(null);
      console.log('Quiz updated successfully');
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };
  

  // Handle word editing
  const handleWordChange = (index, value) => {
    const updatedWords = [...selectedQuiz.words];
    updatedWords[index] = value;
    setSelectedQuiz({ ...selectedQuiz, words: updatedWords });
  };

  // Add a new word when the user presses "Enter" or tabs into the next cell
  useEffect(() => {
    if (editingWordIndex !== null) {
      const inputElement = document.getElementById(`word-input-${editingWordIndex}`);
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [editingWordIndex]);
  
  // Add a new word when the user presses "Enter" or tabs into the next cell
// Add a new word when the user presses "Enter" or tabs into the next cell
const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault(); // Prevent default behavior
  
      const totalWords = selectedQuiz.words.length;
      let nextIndex = index + 1;
  
      if (nextIndex >= totalWords) {
        // Add a new word and set editing index
        setSelectedQuiz((prevQuiz) => {
          const newWords = [...prevQuiz.words, ''];
          setEditingWordIndex(newWords.length - 1); // Set to the newly added word
          return { ...prevQuiz, words: newWords };
        });
      } else {
        setEditingWordIndex(nextIndex); // Move to the next word
      }
    }
  };
  
  
  /////////////////////////////////

  // Handle Upload CSV button click
const handleUploadCSVClick = () => {
    setShowUploadModal(true);
  };
  
  // Handle Download CSV button click
  const handleDownloadCSVClick = () => {
    if (selectedQuiz && selectedQuiz.words && selectedQuiz.words.length > 0) {
      const csvContent = selectedQuiz.words.map(word => `${word}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedQuiz.quizName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No words available to download.');
    }
  };
  
  // Handle file upload
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        // Parse CSV text
        const words = text.split('\n').map((line) => line.trim()).filter((line) => line !== '');
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
    if (uploadOption === 'append') {
      // Append words to existing words
      const newWords = [...selectedQuiz.words, ...wordsArray];
      setSelectedQuiz((prevQuiz) => ({ ...prevQuiz, words: newWords }));
    } else if (uploadOption === 'replace') {
      // Replace existing words with uploaded words
      setSelectedQuiz((prevQuiz) => ({ ...prevQuiz, words: wordsArray }));
    }
    setShowSecondModal(false); // Close the second modal
  };
  
  // Handle modal close
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setShowSecondModal(false); // Ensure second modal is closed too
  };
  
  
  ////////////////////////////////
  // Delete a word from the quiz
  const deleteWord = (index) => {
    const updatedWords = selectedQuiz.words.filter((_, i) => i !== index);
    setSelectedQuiz({ ...selectedQuiz, words: updatedWords });
  };

  // Function to save words to Firestore after modification
  // Function to save words to Firestore after modification and remove empty words
  const saveWords = async () => {
    if (selectedQuiz) {
      // Filter out any undefined or empty words from the array
      const filteredWords = selectedQuiz.words.filter((word) => word && word.trim() !== '');
  
      // Check for duplicates
      const wordCounts = {};
      const duplicates = [];
  
      filteredWords.forEach((word) => {
        const lowerWord = word.toLowerCase().trim();
        if (wordCounts[lowerWord]) {
          wordCounts[lowerWord]++;
          if (wordCounts[lowerWord] === 2) {
            duplicates.push(word);
          }
        } else {
          wordCounts[lowerWord] = 1;
        }
      });
  
      if (duplicates.length > 0) {
        setDuplicatesFound(duplicates);
        setShowDuplicatePrompt(true);
        return; // Exit the function until the user makes a decision
      }
  
      // Proceed to save without duplicates
      await saveWordsToFirestore(filteredWords);
    }
  };
  
  
  const saveWordsToFirestore = async (wordsToSave) => {
    const quizDocRef = doc(db, 'Quiz', selectedQuiz.quizName);
    try {
      await updateDoc(quizDocRef, {
        words: wordsToSave,
        numberOfWords: wordsToSave.length, // Update the word count
      });
      setSelectedQuiz((prevQuiz) => ({
        ...prevQuiz,
        words: wordsToSave,
        numberOfWords: wordsToSave.length,
      }));
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide it after 3 seconds
      console.log('Words updated successfully!');
    } catch (error) {
      console.error('Error updating words:', error);
    }
  };
  
  if (loading) {
    return <p className="text-white">Loading quizzes...</p>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section - Scrollable List */}
      <div className="left-section w-1/3 overflow-y-auto h-full p-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
                key={quiz.id}
                className={`bg-[#202020] p-4 rounded-lg mb-4 shadow-lg border border-gray-700 ${
                    selectedQuiz?.id === quiz.id ? 'brightness-125' : 'brightness-100'
                }`}
                style={{ transition: '0.3s ease', cursor: 'pointer' }}
                onClick={() => handleCardClick(quiz)}
                >
                <div className="relative w-full" style={{ paddingTop: '60.43%' /* (190/266)*100% */ }}>
                    <img
                    src={quiz.image}
                    alt={quiz.quizName}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg mb-4"
                    />
                </div>
                <h2 className="text-xl text-white font-bold mt-4 mb-2">{quiz.quizName}</h2>
                <p className="text-gray-400 mb-2">Type: {quiz.type}</p>
                <p className="text-gray-400 mb-2">Number of Words: {quiz.numberOfWords}</p>
                <p className="text-gray-400">User Groups: {quiz.userGroups.join(', ')}</p>
            </div>
          ))
        ) : (
          <p className="text-white">No quizzes available.</p>
        )}
      </div>

      {/* Right Section - Detailed Info */}
      <div className="right-section w-2/3 bg-[#202020] p-6 rounded-lg ml-4 h-full overflow-y-auto">
        {selectedQuiz ? (
          <>

            {/* Editable Quiz Name with Buttons */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl text-white relative group flex items-center">
                    {isEditingName ? (
                    <span className="flex items-center">
                        <input
                        className="bg-[#202020] text-white font-bold border-none outline-none"
                        value={updatedQuizName}
                        onChange={(e) => setUpdatedQuizName(e.target.value)}
                        style={{ width: 'auto', backgroundColor: 'transparent' }}
                        />
                        <FaCheck
                        className="ml-2 text-gray-500 cursor-pointer hover:text-[#ffa500] transition-colors duration-200"
                        onClick={updateQuizDetails}
                        />
                        <FaTimes
                        className="ml-2 text-gray-500 cursor-pointer hover:text-[#ffa500] transition-colors duration-200"
                        onClick={() => setIsEditingName(false)}
                        />
                    </span>
                    ) : (
                    <span className="flex items-center">
                        {selectedQuiz.quizName}
                        <FaPencilAlt
                        className="ml-1 text-gray-500 hover:text-white cursor-pointer text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => setIsEditingName(true)}
                        style={{ display: 'inline', marginLeft: '5px', position: 'relative', top: '-2px' }}
                        />
                    </span>
                    )}
                </h2>

                {/* Icon Buttons */}
                <div className="flex space-x-2">
                    {/* Image Upload Button with Tooltip */}
                    <div className="relative group">
                    <button
                        className="text-white p-2 rounded-lg hover:bg-[#ffa500] transition-colors duration-200"
                        onClick={() => setShowImageUploadModal(true)}
                    >
                        <FaImage className="text-xl" />
                    </button>
                    <div className="absolute right-0 mt-2 w-max bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Change Image
                    </div>
                    </div>

                    {/* Upload CSV Button with Tooltip */}
                    <div className="relative group">
                    <button
                        className="text-white p-2 rounded-lg hover:bg-[#ffa500] transition-colors duration-200"
                        onClick={handleUploadCSVClick}
                    >
                        <FaUpload className="text-xl" />
                    </button>
                    <div className="absolute right-0 mt-2 w-max bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Upload Words
                    </div>
                    </div>

                    {/* Download CSV Button with Tooltip */}
                    <div className="relative group">
                    <button
                        className="text-white p-2 rounded-lg hover:bg-[#ffa500] transition-colors duration-200"
                        onClick={handleDownloadCSVClick}
                    >
                        <FaDownload className="text-xl" />
                    </button>
                    <div className="absolute right-0 mt-2 w-max bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Download Words
                    </div>
                    </div>
                </div>
            </div>

            {showImageSuccessMessage && (
            <div className="text-green-500 mt-2">
                Image updated successfully!
            </div>
            )}

            {/* Quiz Details */}
            <p className="text-gray-400 mb-2">Type: {selectedQuiz.type}</p>
            <p className="text-gray-400 mb-2">Number of Words: {selectedQuiz.words.length}</p>

            {/* Editable User Groups */}
            <div className="mb-4 relative group">
  <p className="text-gray-400 mb-2 flex items-center">
    User Groups:{' '}
    {isEditingGroups ? (
      <>
        <div style={{ width: '300px' }}>
          <Select
            isMulti
            options={[
              { value: 'select_all', label: 'Select All' },
              ...allUserGroups.map((group) => ({ value: group, label: group })),
            ]}
            value={
              selectedUserGroups.length === allUserGroups.length
                ? [{ value: 'select_all', label: 'Select All' }]
                : selectedUserGroups.map((group) => ({ value: group, label: group }))
            }
            onChange={(selectedOptions) => {
              if (selectedOptions.some((option) => option.value === 'select_all')) {
                // If 'Select All' is selected, select all user groups
                setSelectedUserGroups(allUserGroups);
              } else {
                setSelectedUserGroups(selectedOptions.map((option) => option.value));
              }
            }}
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
        <FaCheck
          className="ml-2 text-gray-500 cursor-pointer hover:text-[#ffa500] transition-colors duration-200"
          onClick={() => {
            updateQuizDetails();
            setIsEditingGroups(false);
          }}
        />
        <FaTimes
          className="ml-2 text-gray-500 cursor-pointer hover:text-[#ffa500] transition-colors duration-200"
          onClick={() => setIsEditingGroups(false)}
        />
      </>
    ) : (
      <>
        {selectedQuiz.userGroups.join(', ')}
        <FaPencilAlt
          className="ml-1 text-gray-500 hover:text-white cursor-pointer text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => setIsEditingGroups(true)}
          style={{ display: 'inline', marginLeft: '5px', position: 'relative', top: '-2px' }}
        />
      </>
    )}
  </p>
</div>


            {/* Editable Words Table */}
            <table className="w-full text-left mt-4 border-collapse">
                <tbody>
                    {selectedQuiz.words.map((word, index) => (
                    index % 3 === 0 ? (
                        <tr key={index}>
                        {[0, 1, 2].map((i) => (
                            <td
                            key={i}
                            className="border border-gray-500 text-gray-300 px-2 py-1 relative"
                            style={{
                                minWidth: '200px',
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                boxSizing: 'border-box',
                            }}
                            onClick={() => setEditingWordIndex(index + i)} // Set editing index on click
                            >
                            {editingWordIndex === index + i ? (
                                <>
                                <input
                                    id={`word-input-${index + i}`} // Unique id for each input
                                    className="bg-transparent text-white outline-none"
                                    value={selectedQuiz.words[index + i] || ''}
                                    onChange={(e) => handleWordChange(index + i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index + i)} // Call handleKeyDown
                                    style={{
                                    border: 'none',
                                    padding: '0',
                                    boxShadow: 'none',
                                    appearance: 'none',
                                    backgroundColor: 'transparent',
                                    width: 'calc(100% - 20px)',
                                    }}
                                />
                                <FaTrashAlt
                                    className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-200"
                                    onClick={() => deleteWord(index + i)}
                                    style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.8em',
                                    }}
                                />
                                </>
                            ) : (
                                <>
                                {`${index + i + 1}. ${selectedQuiz.words[index + i] || ''}`}
                                <FaTrashAlt
                                    className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-200"
                                    onClick={() => deleteWord(index + i)}
                                    style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.8em',
                                    visibility: 'hidden', // Hide delete icon when not editing
                                    }}
                                />
                                </>
                            )}
                            </td>
                        ))}
                        </tr>
                    ) : null
                    ))}
                </tbody>
                </table>



            {/* Save Changes */}
            {/* Add Word and Save Changes Buttons */}
            <div className="flex space-x-4 mt-4">
            <button
                className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00]"
                onClick={addEmptyWord} // On-click event to add a new empty word
            >
                Add Word
            </button>

            <button
                className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00]"
                onClick={saveWords}
            >
                Save Changes
            </button>
            </div>

            {showSuccessMessage && (
            <div className="text-green-500 mt-2">
                Changes updated successfully!
            </div>
            )}

{showDuplicatePrompt && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-[#202020] p-6 rounded-lg">
      <h3 className="text-white text-lg font-bold mb-4">
        Duplicate Words Detected
      </h3>
      <p className="text-gray-300 mb-4">
        The following words are duplicated: {duplicatesFound.join(', ')}. Do you
        want to keep the duplicates?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={async () => {
            // Recompute filteredWords
            const filteredWords = selectedQuiz.words.filter(
              (word) => word && word.trim() !== ''
            );

            // Remove duplicates
            const uniqueWordsMap = new Map();
            filteredWords.forEach((word) => {
              const lowerWord = word.toLowerCase().trim();
              if (!uniqueWordsMap.has(lowerWord)) {
                uniqueWordsMap.set(lowerWord, word);
              }
            });
            const uniqueWords = Array.from(uniqueWordsMap.values());

            await saveWordsToFirestore(uniqueWords);
            setShowDuplicatePrompt(false);
          }}
        >
          No, Remove Duplicates
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={async () => {
            // Recompute filteredWords
            const filteredWords = selectedQuiz.words.filter(
              (word) => word && word.trim() !== ''
            );

            // Keep duplicates
            await saveWordsToFirestore(filteredWords);
            setShowDuplicatePrompt(false);
          }}
        >
          Yes, Keep Duplicates
        </button>
      </div>
    </div>
  </div>
)}


          </>
        ) : (
          <h2 className="text-2xl text-white mb-4">Select a Quiz for More Details</h2>
        )}
      </div>
        {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Manual Words Upload</h2>
                    <button onClick={handleCloseUploadModal} className="text-gray-400 hover:text-white">
                    &times;
                    </button>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                    <p className="font-semibold mb-2">Instructions:</p>
                    <ul className="list-disc list-inside">
                    <li>Upload your .CSV file containing words in the correct format.</li>
                    <li>Make sure each word is in its own row within the CSV file.</li>
                    <li>The first column should contain the words you want to upload.</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="mb-6">
                    <p className="font-semibold mb-2">Important notes:</p>
                    <ul className="list-disc list-inside">
                    <li>The uploaded file will replace or append to the current words based on your selection.</li>
                    <li>Make sure the CSV file contains valid words and is formatted properly.</li>
                    </ul>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept=".csv"
                    id="fileInput"
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
                    onClick={() => document.getElementById('fileInput').click()} // Trigger file input click
                    className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] transition-colors duration-200"
                    >
                    Upload file
                    </button>
                </div>
                </div>
            </div>
            )}



        {showSecondModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Review Processed Words</h2>
        <button onClick={() => setShowSecondModal(false)} className="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>

      {/* Processed Words */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Words:</p>
        <textarea
          className="w-full h-40 p-2 bg-[#303030] text-white rounded mb-4"
          value={processedWords.join('\n')}
          onChange={(e) => setProcessedWords(e.target.value.split('\n'))}
        />
      </div>

      {/* Append or Replace Options */}
      <div className="mb-6">
        <label className="text-white mr-2">Add words:</label>
        <label className="text-white mr-2">
          <input
            type="radio"
            value="append"
            checked={uploadOption === 'append'}
            onChange={() => setUploadOption('append')}
            className="mr-1"
          />
          After existing words
        </label>
        <label className="text-white">
          <input
            type="radio"
            value="replace"
            checked={uploadOption === 'replace'}
            onChange={() => setUploadOption('replace')}
            className="mr-1"
          />
          Replace current quiz words
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
          Add Words
        </button>
      </div>
    </div>
  </div>
)}

            {showImageUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Select Image</h2>
                    <button onClick={() => setShowImageUploadModal(false)} className="text-gray-400 hover:text-white">
                    &times;
                    </button>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                    <p>Please select a JPEG image with an aspect ratio close to 1.4 (e.g., 266×190 pixels). The file size should be under 100 KB.</p>
                    <p>We recommend using an image with similar dimensions to maintain consistency.</p>
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
                    className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] transition-colors duration-200"
                    >
                    Select Image
                    </button>
                </div>
                </div>
            </div>
            )}

            {showImagePreviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#202020] text-white p-6 rounded-lg w-1/2">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Preview Image</h2>
                    <button onClick={() => setShowImagePreviewModal(false)} className="text-gray-400 hover:text-white">
                    &times;
                    </button>
                </div>

                {/* Image Preview */}
                <div className="mb-6 flex justify-center">
                    <img src={imagePreviewURL} alt="Preview" />
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
                    onClick={handleImageUpload} // Function to upload image and update quiz
                    className="bg-[#ffa500] text-white px-4 py-2 rounded-lg hover:bg-[#ff9f00] transition-colors duration-200"
                    >
                    Confirm and Upload
                    </button>
                </div>
                </div>
            </div>
            )}



    </div>
  );
};

export default QuizManagement;
