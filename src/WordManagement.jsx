// src/components/Tools/WordManagement.jsx
import React, { useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust the path based on your project structure
import { FaSearch, FaPlus, FaEdit, FaSave, FaTimes, FaTrashAlt } from 'react-icons/fa';

const WordManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wordData, setWordData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newWordData, setNewWordData] = useState({});
  const [isCreatingNewWord, setIsCreatingNewWord] = useState(false); // New state variable

  // States for handling delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    const wordDocRef = doc(db, 'JSON', searchTerm.trim().toLowerCase());

    try {
      const wordDoc = await getDoc(wordDocRef);
      if (wordDoc.exists()) {
        setWordData(wordDoc.data());
        setNewWordData(wordDoc.data());
        setIsEditing(false);
        setIsCreatingNewWord(false);
      } else {
        setWordData(null);
        setNewWordData({}); // Reset newWordData to prevent pre-filling
        setIsCreatingNewWord(true); // Show creation form
      }
    } catch (error) {
      console.error('Error searching for word:', error);
      alert('An error occurred while searching for the word.');
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle boolean (offensive)
    if (type === 'checkbox') {
      setNewWordData({
        ...newWordData,
        [name]: checked,
      });
    }
    // Handle array (pronunciations)
    else if (name === 'pronunciations') {
      setNewWordData({
        ...newWordData,
        pronunciations: value
          .split(',')
          .map((pron) => pron.trim())
          .filter((pron) => pron !== ''),
      });
    }
    // Handle other input types
    else {
      setNewWordData({
        ...newWordData,
        [name]: value,
      });
    }
  };

  // Function to handle update
  const handleUpdate = async () => {
    const wordDocRef = doc(db, 'JSON', wordData.id.trim().toLowerCase());

    try {
      await updateDoc(wordDocRef, newWordData);
      setWordData(newWordData);
      setIsEditing(false);
      alert('Word updated successfully!');
    } catch (error) {
      console.error('Error updating word:', error);
      alert('Failed to update the word.');
    }
  };

  // Function to handle create
  const handleCreate = async () => {
    const newId = newWordData.id ? newWordData.id.trim().toLowerCase() : '';

    // Validate required fields
    if (!newId || !newWordData.headword || !newWordData.shortDefinition) {
      alert('Please fill out all required fields (ID, Headword, and Short Definition).');
      return;
    }

    const wordDocRef = doc(db, 'JSON', newId);

    try {
      // Check if a document with the same ID already exists
      const existingDoc = await getDoc(wordDocRef);
      if (existingDoc.exists()) {
        alert('A word with this ID already exists. Please choose a different ID.');
        return;
      }

      await setDoc(wordDocRef, newWordData);
      setWordData(newWordData);
      setIsCreatingNewWord(false);
      alert('Word created successfully!');
    } catch (error) {
      console.error('Error creating word:', error);
      alert('Failed to create the word.');
    }
  };

  // Function to handle delete
  const handleDelete = async () => {
    if (!wordData || !wordData.id) return;

    const wordDocRef = doc(db, 'JSON', wordData.id.trim().toLowerCase());

    try {
      await deleteDoc(wordDocRef);
      setWordData(null);
      setNewWordData({});
      setIsEditing(false);
      setIsCreatingNewWord(false);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      alert('Word deleted successfully!');
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('Failed to delete the word.');
    }
  };

  return (
    <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Word Management</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg bg-[#303030] text-white focus:outline-none"
          placeholder="Enter word to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#ffa500] p-2 rounded-r-lg hover:bg-[#ff9f00] flex items-center justify-center"
        >
          <FaSearch className="text-white" />
        </button>
      </form>

      {/* Display Word Data or Create New Word Form */}
      {(wordData || isCreatingNewWord) && (
        <div className="bg-[#1f1f1f] p-4 rounded-lg shadow-inner">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white">
              {isCreatingNewWord
                ? 'Create New Word'
                : `Word Details: ${wordData.id}`}
            </h3>
            {!isCreatingNewWord && !isEditing && wordData && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            )}
          </div>

          {/* Form: Editing or Creating */}
          <div className="space-y-4">
            {/* ID Field - Only for Creation */}
            {isCreatingNewWord && (
              <div>
                <label className="block text-gray-300 mb-1">
                  ID<span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  name="id"
                  className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                  value={newWordData.id || ''}
                  onChange={handleChange}
                  required
                  placeholder="Unique identifier for the word (e.g., apple)"
                />
              </div>
            )}

            {/* Headword */}
            <div>
              <label className="block text-gray-300 mb-1">
                Headword<span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="headword"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={newWordData.headword || ''}
                onChange={handleChange}
                required
                placeholder="Enter headword"
              />
            </div>

            {/* Etymology */}
            <div>
              <label className="block text-gray-300 mb-1">Etymology:</label>
              <input
                type="text"
                name="etymology"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={newWordData.etymology || ''}
                onChange={handleChange}
                placeholder="Enter etymology"
              />
            </div>

            {/* Short Definition */}
            <div>
              <label className="block text-gray-300 mb-1">
                Short Definition<span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="shortDefinition"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={newWordData.shortDefinition || ''}
                onChange={handleChange}
                required
                placeholder="Enter short definition"
              />
            </div>

            {/* Part of Speech */}
            <div>
              <label className="block text-gray-300 mb-1">Part of Speech:</label>
              <input
                type="text"
                name="partOfSpeech"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={newWordData.partOfSpeech || ''}
                onChange={handleChange}
                placeholder="e.g., Noun"
              />
            </div>

            {/* Pronunciations */}
            <div>
              <label className="block text-gray-300 mb-1">
                Pronunciations (comma-separated):
              </label>
              <input
                type="text"
                name="pronunciations"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={
                  newWordData.pronunciations
                    ? newWordData.pronunciations.join(', ')
                    : ''
                }
                onChange={handleChange}
                placeholder="e.g., /ˈæp.əl/, /ˈæp.l̩/"
              />
            </div>

            {/* Example Sentence */}
            <div>
              <label className="block text-gray-300 mb-1">Example Sentence:</label>
              <textarea
                name="exampleSentence"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none resize-none"
                value={newWordData.exampleSentence || ''}
                onChange={handleChange}
                placeholder="Enter example sentence"
              />
            </div>

            {/* Offensive */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="offensive"
                className="mr-2"
                checked={newWordData.offensive || false}
                onChange={handleChange}
              />
              <label className="text-gray-300">Offensive</label>
            </div>

            {/* Section */}
            <div>
              <label className="block text-gray-300 mb-1">Section:</label>
              <input
                type="text"
                name="section"
                className="w-full p-2 rounded bg-[#303030] text-white focus:outline-none"
                value={newWordData.section || ''}
                onChange={handleChange}
                placeholder="Enter section"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {isCreatingNewWord ? (
                <>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                    onClick={handleCreate}
                  >
                    <FaSave className="mr-2" /> Create New Word
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                    onClick={() => {
                      setIsCreatingNewWord(false);
                      setNewWordData({});
                    }}
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </>
              ) : isEditing && wordData ? (
                <>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                    onClick={handleUpdate}
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrashAlt className="mr-2" /> Delete Word
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                    onClick={() => {
                      setIsEditing(false);
                      setNewWordData(wordData);
                    }}
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && wordData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#202020] p-6 rounded-lg w-1/2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white font-bold">Confirm Delete Word</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Warning Message */}
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the word "
              <strong>{wordData.id}</strong>"? This action{' '}
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
                onClick={handleDelete}
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
            <h3 className="text-white text-lg font-bold mb-2">Word Deleted Successfully!</h3>
            <p className="text-white">The word has been removed from the collection.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordManagement;
