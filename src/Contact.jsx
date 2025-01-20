import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import contact from './assets/contact.png';
import { db } from './firebaseConfig'; // Import Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions

const Contact = () => {
  const [formType, setFormType] = useState('student'); // 'student' or 'teacher'

  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+880');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  // State for handling form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Handler to switch form types
  const handleToggle = (type) => {
    setFormType(type);
    // Reset form fields when toggling
    setFirstName('');
    setLastName('');
    setOrganizationName('');
    setPosition('');
    setEmail('');
    setPhonePrefix('+880');
    setPhoneNumber('');
    setMessage('');
    setSubmitStatus(null);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic validation
    if (formType === 'teacher') {
      if (!organizationName.trim() || !position.trim()) {
        alert('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Optional: Add more robust validation (e.g., email format)

    // Prepare data to be saved
    const contactData = {
      formType,
      firstName,
      lastName,
      organizationName: formType === 'teacher' ? organizationName : null,
      position: formType === 'teacher' ? position : null,
      email,
      phone: formType === 'student' ? `${phonePrefix} ${phoneNumber}` : null,
      message,
      submittedAt: Timestamp.fromDate(new Date()), // Record submission time
    };

    try {
      // Add a new document with a generated id
      await addDoc(collection(db, 'contactUs'), contactData);
      setSubmitStatus('success');
      // Reset form fields after successful submission
      setFirstName('');
      setLastName('');
      setOrganizationName('');
      setPosition('');
      setEmail('');
      setPhonePrefix('+880');
      setPhoneNumber('');
      setMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className="
        bg-black text-white 
        flex flex-col md:flex-row 
        justify-between 
        items-center md:items-start 
        min-h-screen 
        px-4 sm:px-6 md:px-16 
        py-12 
        overflow-x-hidden
      "
    >
      {/* Left Section */}
      <div className="flex-1 text-left space-y-6">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-2xl font-semibold">Reach Out Anytime</p>
        <p className="text-gray-400">
          Whether you need support from the Hive team or you're a school/organization interested in bringing our Hive Spelling app to your students, we're here to help. Fill out the form to get in touch with us.
        </p>

        {/* Contact Details */}
        <div className="space-y-6">
          {/* First Email */}
          <div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#ffa500] text-xl" />
              <p className="text-lg">arastogi@hivespelling.com</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffa500] to-[#ff4500] w-full mt-2"></div>
          </div>

          {/* Second Email */}
          <div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#ffa500] text-xl" />
              <p className="text-lg">erastogi@hivespelling.com</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffa500] to-[#ff4500] w-full mt-2"></div>
          </div>

          {/* Phone Number */}
          <div>
            <div className="flex items-center space-x-4">
              <FaPhone className="text-[#ffa500] text-xl" />
              <p className="text-lg">832 879 3599</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#ffa500] to-[#ff4500] w-full mt-2"></div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-6">
          <a
            href="https://www.instagram.com/hive_spelling/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            aria-label="Instagram"
          >
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://www.facebook.com/people/Hive-Spelling-Bee-Prep-App/61571069093135/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            aria-label="Facebook"
          >
            <FaFacebook className="text-xl" />
          </a>
          <a
            href="https://www.linkedin.com/company/hive-spelling?trk=public_profile_topcard-current-company"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-xl" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCxdmJyVva8k7cjwBPK7ztIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            aria-label="YouTube"
          >
            <FaYoutube className="text-xl" />
          </a>
        </div>
      </div>

      {/* Center Image */}
      <div className="flex-1 flex justify-center my-12 md:my-0">
        <img
          src={contact}
          alt="Contact Illustration"
          className="w-full max-w-sm rounded-2xl h-100 object-cover hidden sm:block"
        />
      </div>

      {/* Right Section (Contact Form) */}
      <div className="
        flex-1 
        bg-black 
        p-6 
        rounded-lg 
        w-10/12 sm:w-4/5 md:w-auto 
        mx-auto 
        max-w-md
      ">
        {/* Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="relative inline-flex bg-gray-700 rounded-full p-3">
            {/* Slider */}
            <span
              className={`
                absolute top-0 left-0 w-1/2 h-full bg-white rounded-full 
                transition-transform duration-300 ease-out 
                ${formType === 'teacher' ? 'translate-x-full' : 'translate-x-0'}
              `}
            />
            {/* Toggle Buttons */}
            <button
              onClick={() => handleToggle('student')}
              className={`
                relative z-10 text-sm px-2 sm:px-2 py-3 rounded-full 
                ${formType === 'student' ? 'text-black font-medium' : 'text-gray-300'}
              `}
            >
              Students
            </button>
            <button
              onClick={() => handleToggle('teacher')}
              className={`
                relative z-10 text-sm px-2 sm:px-2 py-3 rounded-full 
                ${formType === 'teacher' ? 'text-black font-medium' : 'text-gray-300'}
              `}
            >
              Educators
            </button>
          </div>
        </div>

        {/* Success and Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded-md text-center">
            Your message has been successfully sent!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-md text-center">
            There was an error sending your message. Please try again later.
          </div>
        )}

        {/* Contact Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {formType === 'teacher' && (
            <>
              {/* School/Organization Name & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* School/Organization Name */}
                <div>
                  <label htmlFor="organization-name" className="block text-sm font-medium text-gray-400">
                    School/Org Name
                  </label>
                  <input
                    id="organization-name"
                    type="text"
                    placeholder="School/Organization Name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3"
                    required={formType === 'teacher'}
                  />
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-400">
                    Position
                  </label>
                  <input
                    id="position"
                    type="text"
                    placeholder="Your Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3"
                    required={formType === 'teacher'}
                  />
                </div>
              </div>
            </>
          )}

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-400">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-400">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400">
              Write Message
            </label>
            <textarea
              id="message"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-md border border-gray-600 p-3 h-32"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full 
                bg-white 
                text-black 
                font-medium 
                rounded-md 
                py-3 
                hover:bg-gray-200 
                flex items-center justify-center 
                disabled:opacity-50
              "
            >
              {isSubmitting ? 'Submitting...' : 'Submit'} <span className="ml-2">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
