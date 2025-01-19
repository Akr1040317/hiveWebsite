import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

// Intersection Observer
import { useInView } from 'react-intersection-observer';

// Existing image imports
import homeImage1 from './assets/home1.png';
import homeImage2 from './assets/home2.png';
import homeImage3 from './assets/home3.png';
import appIconImage from './assets/app-icon.jpg';

// Use the same placeholders for the 6 features
import phone1 from './assets/phone1.png';
import phone2 from './assets/phone2.png';
import phone3 from './assets/phone3.png';
import phone4 from './assets/phone4.png'; // (Unused in sample)
import phone5 from './assets/phone5.png'; // (Unused in sample)
import phone6 from './assets/phone6.png'; // (Unused in sample)

export default function Hero() {
  // 6 separate items for the HERO section to animate in order:
  // (#1: small bubble text, #2: big heading lines, #3: paragraph, #4: button, #5: center image, #6: side images)
  // We originally had 7 including the nav, but we are removing nav fade-in now.
  const [showItem1, setShowItem1] = useState(false);
  const [showItem2, setShowItem2] = useState(false);
  const [showItem3, setShowItem3] = useState(false);
  const [showItem4, setShowItem4] = useState(false);
  const [showItem5, setShowItem5] = useState(false);
  const [showItem6, setShowItem6] = useState(false);

  useEffect(() => {
    // Stagger each item with ~300ms gaps for slight overlap
    setTimeout(() => setShowItem1(true), 500);
    setTimeout(() => setShowItem2(true), 800);
    setTimeout(() => setShowItem3(true), 1100);
    setTimeout(() => setShowItem4(true), 1400);
    setTimeout(() => setShowItem5(true), 1700);
    setTimeout(() => setShowItem6(true), 2000);
  }, []);

  // =============================
  // Intersection Observers for "Features" section
  // =============================
  // Title + description above the features
  const { ref: featuresTitleRef, inView: featuresTitleInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // For each of the 6 repeated features (Feature blocks)
  const { ref: featureRef1, inView: feature1InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featureRef2, inView: feature2InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featureRef3, inView: feature3InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featureRef4, inView: feature4InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featureRef5, inView: feature5InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featureRef6, inView: feature6InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <>
      {/* ============== HEADER (NO ANIMATION) ============== */}
      <header
        id="page-header"
        className={`
          sticky top-0 z-50
          flex flex-none items-center py-4 px-8
          bg-black/80
          backdrop-blur-md
        `}
      >
        <div className="container mx-auto overflow-hidden flex items-center justify-between">
          {/* Logo + Navigation */}
          <div className="flex items-center space-x-24 px-8">
            <a
              href="#"
              className="inline-flex items-center gap-3 text-2xl font-bold tracking-wide text-white hover:text-gray-400"
            >
              <img src={appIconImage} alt="App Icon" className="w-8 h-8" />
              <span>Hive</span>
            </a>
            <nav className="flex items-center space-x-8">
              <Link
                to="home"
                smooth={true}
                duration={500}
                className="text-md font-medium text-[#ffa500] hover:text-white"
              >
                Home
              </Link>
              <ScrollLink
                to="features"
                smooth={true}
                duration={500}
                className="text-md font-medium text-gray-300 hover:text-white"
              >
                Features
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                className="text-md font-medium text-gray-300 hover:text-white"
              >
                Contact
              </ScrollLink>
            </nav>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-10 items-center px-8">
            <Link
              to="/login"
              className="text-md font-medium text-white hover:text-gray-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-md font-medium text-black hover:bg-gray-200"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </header>

      {/* ============== HERO SECTION ============== */}
      <div
        className="relative text-gray-100 pb-20"
        style={{ backgroundColor: '#000000' }}
      >
        <div className="container relative mx-auto px-0 py-10 lg:px-0 lg:py-5 text-center">
          {/* Light Overlay Box */}
          <div
            className="relative mx-auto rounded-2xl p-10 shadow-lg backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: '#121920',
              maxWidth: 'calc(100% - 64px)',
              height: '1225px',
            }}
          >
            {/* #1: "Conquer spelling with Hive!" */}
            <p
              className={`
                mb-4 mt-4 inline-block rounded-full bg-gray-700 px-4 py-4 text-sm font-medium text-gray-300
                ${showItem1 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              Conquer spelling with Hive!
            </p>

            {/* #2: "Learn to Spell Intelligently with Hive" */}
            <h1
              className={`
                mb-4 mt-6 text-4xl font-bold text-white max-w-2xl mx-auto sm:text-5xl
                ${showItem2 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              Learn to Spell
              <span className="italic text-[#ffa500]"> Intelligently </span>
            </h1>
            <h1
              className={`
                mb-10 mt-0 text-4xl font-bold text-white max-w-2xl mx-auto sm:text-5xl
                ${showItem2 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              with Hive
            </h1>

            {/* #3: Paragraph text */}
            <p
              className={`
                mb-4 text-lg text-gray-400 max-w-3xl mx-auto
                ${showItem3 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              Win your spelling bee with Hive!
              Learn the art of spelling from a 2022 National Spelling Bee Finalist with lessons, quizzes, 
              official study lists, daily words of the day, & study tips.
            </p>

            {/* #4: Button */}
            <a
              href="https://apps.apple.com/us/app/hive-spell-intelligently/id6479415050"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className={`
                  mt-10 mb-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-md font-medium text-black hover:bg-gray-200
                  ${showItem4 ? 'opacity-100' : 'opacity-0'}
                  transition-opacity duration-500 ease-in-out
                `}
              >
                <span className="mr-2"></span> Download for iOS
              </button>
            </a>

            {/* #5 (center image), #6 (left & right images) */}
            <div className="relative mt-24 flex justify-center items-center">
              {/* Left Diagonal Image (#6) */}
              <img
                src={homeImage2}
                alt="Lesson preview left"
                className={`
                  absolute left-[30px] transform scale-125 rotate-[-10deg] z-0
                  ${showItem6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                `}
                style={{ width: '420px', top: '80px' }}
              />
              {/* Center Image (#5) */}
              <img
                src={homeImage1}
                alt="Lesson preview center"
                className={`
                  relative z-20 transform scale-125
                  ${showItem5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                `}
                style={{ width: '420px' }}
              />
              {/* Right Diagonal Image (#6) */}
              <img
                src={homeImage3}
                alt="Lesson preview right"
                className={`
                  absolute right-[30px] transform scale-125 rotate-[10deg] z-10
                  ${showItem6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                `}
                style={{ width: '420px', top: '80px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================
          Follow us to get notified
          (Placeholder for any other sections)
      ==========================*/}

      {/* ============== FEATURES SECTION ============== */}
      <div
        id="features"
        className="text-gray-100"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        {/* Title + Description */}
        <div
          ref={featuresTitleRef}
          className="container mx-auto px-6 pt-20 text-center"
        >
          <h2
            className={`
              text-6xl font-medium text-white mb-4 
              transition-opacity duration-700
              ${featuresTitleInView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Learn to spell smarter, <br></br> not harder.
          </h2>
          <p
            className={`
              text-gray-400 text-lg max-w-2xl mx-auto
              transition-opacity duration-700 delay-300
              ${featuresTitleInView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            A comprehensive spelling app that goes beyond rote memorization by focusing on why words are spelled the way they 
            are — so you can learn faster & spell with confidence.
          </p>
        </div>

        {/* =============== Feature 1 (Image Right) =============== */}
        <div
          ref={featureRef1}
          className="min-h-screen flex items-center py-20"
        >
          <div
            className={`
              container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12
              transition-opacity duration-700 delay-300
              ${feature1InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text Section (Fade In Only) */}
            <div className="md:w-1/2 text-left space-y-4">
              <h2 className="text-6xl font-medium text-white leading-normal">
              Learning Tracks for Every Level
              </h2>
              <p className="text-gray-400 max-w-md">
              Tailored learning paths guide you through spelling mastery, adapting to your level and goals—whether for fun, school, or the National Spelling Bee. Tracks include: 
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Beginnings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Prepping for School Bee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Prepping for County/State Bee</span>
                </div>
                
              </div>
            </div>

            {/* Gradient + Image (Slide Up) */}
            <div
              className={`
                md:w-1/2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl"
                style={{
                  width: '1000px',
                  height: '700px',
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone1}
                  alt="Feature 1"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature1InView
                      ? 'opacity-100 translate-y-0 delay-500'
                      : 'opacity-0 translate-y-20 delay-500'
                    }
                  `}
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 2 (Image Left) =============== */}
        <div
  ref={featureRef2}
  className="min-h-screen flex items-center py-20"
>
  <div
    className={`
      container mx-auto px-6 flex flex-col md:flex-row-reverse items-center justify-between gap-12
      transition-opacity duration-700 delay-300
      ${feature2InView ? 'opacity-100' : 'opacity-0'}
    `}
  >
    {/* Text Section (Fade In Only) */}
    <div className="md:w-1/2 text-left space-y-4">
      <h2 className="text-6xl font-medium text-white leading-normal">
        Lessons by a National Finalist
      </h2>
      <p className="text-gray-400 max-w-md">
      Intuitive spelling lessons reduce the need for memorization with a curriculum 
      designed to focus on the patterns, rules, and tricks that govern how words are spelled.
      </p>
      {/* Feature Stats */}
      <div className="mt-8 max-w-5xl pt-6">
        {/* Use Flexbox and Adjust Gap */}
        <div className="flex flex-col md:flex-row items-start md:items-stretch gap-6">
          {/* Box 1 */}
          <div
            className="flex-1 bg-[#141310] border-2 border-[#3F2F17] rounded-xl p-6 text-left"
          >
            <h3 className="text-4xl font-bold text-[#ffa500]"> 25+ </h3>
            <p className="text-gray-400 mt-2">
              Lessons and minilessons that teach how to spell words from 8 different languages, plus tips and tricks.
            </p>
          </div>
          {/* Box 2 */}
          <div
            className="flex-1 bg-[#141310] border-2 border-[#3F2F17] rounded-xl p-6 text-left"
          >
            <h3 className="text-4xl font-bold text-[#ffa500]"> > 90%</h3>
            <p className="text-gray-400 mt-2">
              of spelling bee words asked in the Scripps National Spelling Bee are covered in our lessons.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Gradient + Image (Slide Up) */}
    <div
      className={`
        md:w-1/2 flex justify-center transform
        transition-all duration-700 ease-out
        ${feature2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div
        className="relative rounded-3xl"
        style={{
          width: '1000px',
          height: '700px',
          background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
        }}
      >
        <img
          src={phone2}
          alt="Feature 2"
          className={`
            absolute bottom-0 left-1/2 transform -translate-x-1/2
            transition-all duration-700 ease-out
            ${feature2InView
              ? 'opacity-100 translate-y-0 delay-500'
              : 'opacity-0 translate-y-20 delay-500'
            }
          `}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  </div>
</div>


        {/* =============== Feature 3 (Image Right) =============== */}
        <div
          ref={featureRef3}
          className="min-h-screen flex items-center py-20"
        >
          <div
            className={`
              container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12
              transition-opacity duration-700 delay-300
              ${featureRef3 && feature3InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text Section (Fade In Only) */}
            <div className="md:w-1/2 text-left space-y-4">
              <h2 className="text-6xl font-medium text-white leading-normal">
                Quizzes and Official Study Lists
              </h2>
              <p className="text-gray-400 max-w-md">
                Quiz yourself with carefully crafted quizzes and official study lists that give you the most focused preparation, so you can spell confidently.
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Full access to the Official School Spelling Bee Study List</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">20+ quizzes with ~2000 words</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Practice words from 8 different languages of origin</span>
                </div>
                
              </div>
            </div>

            {/* Gradient + Image (Slide Up) */}
            <div
              className={`
                md:w-1/2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl"
                style={{
                  width: '1000px',
                  height: '700px',
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone3}
                  alt="Feature 1"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature3InView
                      ? 'opacity-100 translate-y-0 delay-500'
                      : 'opacity-0 translate-y-20 delay-500'
                    }
                  `}
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 4 (Image Left) =============== */}
        <div
          ref={featureRef4}
          className="min-h-screen flex items-center py-20"
        >
          <div
            className={`
              container mx-auto px-6 flex flex-col md:flex-row-reverse items-center justify-between gap-12
              transition-opacity duration-700 delay-300
              ${feature4InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text Section (Fade In Only) */}
            <div className="md:w-1/2 text-left space-y-4">
              <h2 className="text-6xl font-medium text-white leading-normal">
                In-App Blog Page with Daily Articles
              </h2>
              <p className="text-gray-400 max-w-md">
              Visit The Hive blog for interesting word explanations, study help, and spelling pro-tips to become a master.
              
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Daily Word of the Day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Weekly Articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Important Announcements</span>
                </div>
              </div>
            </div>

            {/* Gradient + Image (Slide Up) */}
            <div
              className={`
                md:w-1/2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl"
                style={{
                  width: '1000px',
                  height: '700px',
                  background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
                }}
              >
                <img
                  src={phone4}
                  alt="Feature 2"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature4InView
                      ? 'opacity-100 translate-y-0 delay-500'
                      : 'opacity-0 translate-y-20 delay-500'
                    }
                  `}
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 5 (Image Right) =============== */}
        <div
          ref={featureRef5}
          className="min-h-screen flex items-center py-20"
        >
          <div
            className={`
              container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12
              transition-opacity duration-700 delay-300
              ${feature5InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text Section (Fade In Only) */}
            <div className="md:w-1/2 text-left space-y-4">
              <h2 className="text-6xl font-medium text-white leading-normal">
                Progress Tracking and Statistics
              </h2>
              <p className="text-gray-400 max-w-md">
              Track your progress and use personal analytics to your advantage. Get access to full quiz results, activity logs, and key statistics that show how you’ve been improving.
              </p>
              
            </div>

            {/* Gradient + Image (Slide Up) */}
            <div
              className={`
                md:w-1/2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature5InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl"
                style={{
                  width: '1000px',
                  height: '700px',
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone5}
                  alt="Feature 1"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature5InView
                      ? 'opacity-100 translate-y-0 delay-500'
                      : 'opacity-0 translate-y-20 delay-500'
                    }
                  `}
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 6 (Image Left) =============== */}
        {/* =============== Feature 6 (Image Left) =============== */}
<div
  ref={featureRef6}
  className="min-h-screen flex items-center py-20"
>
  <div
    className={`
      container mx-auto px-6 flex flex-col md:flex-row-reverse items-center justify-between gap-12
      transition-opacity duration-700 delay-300
      ${feature6InView ? 'opacity-100' : 'opacity-0'}
    `}
  >
    {/* Text Section (Fade In Only) */}
    <div className="md:w-1/2 text-left space-y-4">
      <h2 className="text-6xl font-medium text-white leading-normal">
        Real-Time Global Leaderboard
      </h2>
      <p className="text-gray-400 max-w-md">
        Compete with hundreds of spellers throughout the world and rack up Honey Points with every lesson and quiz.
      </p>

      {/* Big text replacing the bullet points */}
      <h3 className="text-2xl font-semibold text-white mt-10">
        What are you waiting for? Join today and begin competing and learning!
      </h3>

      {/* Button matching the iOS download button style, but with "Download Today" text */}
      <a
        href="https://apps.apple.com/us/app/hive-spell-intelligently/id6479415050"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6"
      >
        <button
          className="
            inline-flex items-center justify-center 
            rounded-full bg-white px-6 py-3 
            text-md font-medium text-black 
            hover:bg-gray-200 mt-4
          "
        >
          <span className="mr-2"></span>
          Download Today
        </button>
      </a>
    </div>

    {/* Gradient + Image (Slide Up) */}
    <div
      className={`
        md:w-1/2 flex justify-center transform
        transition-all duration-700 ease-out
        ${feature6InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div
        className="relative rounded-3xl"
        style={{
          width: '1000px',
          height: '700px',
          background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
        }}
      >
        <img
          src={phone6}
          alt="Feature 6"
          className={`
            absolute bottom-0 left-1/2 transform -translate-x-1/2
            transition-all duration-700 ease-out
            ${feature6InView
              ? 'opacity-100 translate-y-0 delay-500'
              : 'opacity-0 translate-y-20 delay-500'
            }
          `}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  </div>
</div>

      </div>
    </>
  );
}
