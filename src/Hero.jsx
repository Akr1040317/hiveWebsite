import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useInView } from 'react-intersection-observer';

import homeImage1 from './assets/home1new.png';
import homeImage2 from './assets/home2.png';
import homeImage3 from './assets/home3.png';
import appIconImage from './assets/app-icon.jpg';

import phone1 from './assets/phone1.png';
import phone2 from './assets/phone2.png';
import phone3 from './assets/phone3.png';
import phone4 from './assets/phone4.png';
import phone5 from './assets/phone5.png';
import phone6 from './assets/phone6.png';


export default function Hero() {
  // 6 separate items for the HERO section to animate in order
  const [showItem1, setShowItem1] = useState(false);
  const [showItem2, setShowItem2] = useState(false);
  const [showItem3, setShowItem3] = useState(false);
  const [showItem4, setShowItem4] = useState(false);
  const [showItem5, setShowItem5] = useState(false);
  const [showItem6, setShowItem6] = useState(false);

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const headlines = [
    <>
      Learn to Spell <span className="italic text-[#ffa500]">Intelligently</span> <br></br>with Hive
    </>,
    <>Limited time offer till February 28th. <br></br><span className="italic text-[#ffa500]">50% off</span> all plans.</>
  ];

  useEffect(() => {
    // Existing staggered animations
    setTimeout(() => setShowItem1(true), 500);
    setTimeout(() => setShowItem2(true), 800);
    setTimeout(() => setShowItem3(true), 1100);
    setTimeout(() => setShowItem4(true), 1400);
    setTimeout(() => setShowItem5(true), 1700);
    setTimeout(() => setShowItem6(true), 2000);
  
    // Headline switching interval
    const headlineInterval = setInterval(() => {
      setHeadlineIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 5000); // Change every 5 seconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(headlineInterval);
  }, []);

  useEffect(() => {
    // Stagger each item
    setTimeout(() => setShowItem1(true), 500);
    setTimeout(() => setShowItem2(true), 800);
    setTimeout(() => setShowItem3(true), 1100);
    setTimeout(() => setShowItem4(true), 1400);
    setTimeout(() => setShowItem5(true), 1700);
    setTimeout(() => setShowItem6(true), 2000);
  }, []);

  // Intersection Observers for "Features" section
  const { ref: featuresTitleRef, inView: featuresTitleInView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef1, inView: feature1InView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef2, inView: feature2InView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef3, inView: feature3InView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef4, inView: feature4InView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef5, inView: feature5InView } = useInView({
    triggerOnce: true,
  });
  const { ref: featureRef6, inView: feature6InView } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      {/* ============== HEADER ============== */}
      <header
        id="page-header"
        className="sticky top-0 z-50 flex items-center py-4 px-8 bg-black/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo + Navigation */}
          <div className="flex items-center space-x-12 md:space-x-24">
            <a
              href="#"
              className="inline-flex items-center gap-3 text-2xl font-bold tracking-wide text-white hover:text-gray-300"
            >
              <img src={appIconImage} alt="App Icon" className="w-8 h-8" />
              <span>Hive</span>
            </a>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
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
                className="text-md font-medium text-gray-300 hover:text-white cursor-pointer"
              >
                Features
              </ScrollLink>
              <ScrollLink
                to="pricing"
                smooth={true}
                duration={500}
                className="text-md font-medium text-gray-300 hover:text-white cursor-pointer"
              >
                Pricing
              </ScrollLink>
              <ScrollLink
                to="faq"
                smooth={true}
                duration={500}
                className="text-md font-medium text-gray-300 hover:text-white cursor-pointer"
              >
                FAQ
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                className="text-md font-medium text-gray-300 hover:text-white cursor-pointer"
              >
                Contact
              </ScrollLink>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6 items-center">
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
      <section
        id="home"
        className="relative w-full text-gray-100 pb-20"
        style={{ backgroundColor: '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          {/* Light Overlay Box */}
          <div
            className="relative mx-auto rounded-2xl p-10 shadow-lg backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: '#121920',
              minHeight: '600px',
              maxWidth: '100%',
            }}
          >
            {/* #1: "Conquer spelling with Hive!" */}
            <p
              className={`
                mb-2 mt-2 inline-block rounded-full bg-gray-700 px-4 py-3 text-sm font-medium text-gray-300
                ${showItem1 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              Conquer spelling with Hive!
            </p>

            {/* #2: Alternating Headline */}
            <div
              className={`
                relative mx-auto text-center my-6
                transition-opacity duration-500 ease-in-out
              `}
            >
              {/* Container with fixed height to prevent layout shifts */}
              <div className="relative h-24 sm:h-28 md:h-32 lg:h-40">
                {headlines.map((headline, index) => (
                  <h1
                    key={index}
                    className={`
                      absolute top-0 left-0 w-full transition-opacity duration-1000
                      ${headlineIndex === index ? 'opacity-100' : 'opacity-0'}
                      text-2xl sm:text-1xl md:text-5xl lg:text-5xl font-bold text-white
                      leading-tight mt-5
                    `}
                  >
                    {headline}
                  </h1>
                ))}
              </div>
            </div>

            {/* #3: Paragraph text */}
            <p
              className={`
                mb-2 text-lg text-gray-400 max-w-3xl mx-auto
                ${showItem3 ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500 ease-in-out
              `}
            >
              Win your spelling bee with Hive! Learn the art of spelling from a
              2022 National Spelling Bee Finalist with lessons, quizzes, official
              study lists, daily words of the day, &amp; study tips.
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
            <div className="relative mt-32 flex justify-center items-center">
              {/* Left Diagonal Image (#6) */}
              <img
                src={homeImage2}
                alt="Lesson preview left"
                className={`
                  hidden sm:block absolute left-[30px] transform scale-125 rotate-[-10deg] z-0
                  ${showItem6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                  w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3
                  lg:scale-150
                `}
                style={{ top: '80px' }}
              />

              {/* Center Image (#5) */}
              <img
                src={homeImage1}
                alt="Lesson preview center"
                className={`
                  relative z-20 transform scale-125
                  ${showItem5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                  w-7/8 sm:w-2/3 md:w-1/2 lg:w-1/3
                  sm:scale-150 md:scale-110 lg:scale-150
                `}
              />

              {/* Right Diagonal Image (#6) */}
              <img
                src={homeImage3}
                alt="Lesson preview right"
                className={`
                  hidden sm:block absolute right-[30px] transform scale-125 rotate-[10deg] z-10
                  ${showItem6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  transition-transform transition-opacity duration-500 ease-in-out
                  w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3
                  lg:scale-150
                `}
                style={{ top: '80px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============== FEATURES SECTION ============== */}
      <section
        id="features"
        className="w-full text-gray-100 pt-20 pb-16"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        {/* Title + Description */}
        <div ref={featuresTitleRef} className="max-w-7xl mx-auto px-6 text-center">
          <h2
            className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
              font-medium text-white mb-4 
              transition-opacity duration-700
              ${featuresTitleInView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Learn to spell smarter,<br className="hidden sm:block" /> not harder.
          </h2>
          <p
            className={`
              text-gray-400 text-base sm:text-lg max-w-2xl mx-auto
              transition-opacity duration-700 delay-300
              ${featuresTitleInView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            A comprehensive spelling app that goes beyond rote memorization by focusing on 
            <em>why</em> words are spelled the way they are — so you can learn faster &amp; spell with confidence.
          </p>
        </div>

        {/* =============== Feature 1 =============== */}
        <div ref={featureRef1} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Odd Feature: text left, image right at md. 
              On small screens: text first, image second. (Default order) */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature1InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text Section (order-1 for small, no change at md => text left) */}
            <div className="order-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                Learning Tracks for Every Level
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Tailored learning paths guide you through spelling mastery, adapting to your level and goals—whether for fun, school, or the National Spelling Bee.
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                {['Beginnings', 'Prepping for School Bee', 'Prepping for County/State Bee'].map(
                  (item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Image (order-2 for small => below text; stays right at md) */}
            <div
              className={`
                order-2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone1}
                  alt="Feature 1"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature1InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '95%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 2 =============== */}
        <div ref={featureRef2} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Even Feature: text right, image left at md. 
              On small screens: text is *first*, image second => use order classes. */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature2InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Image first at md => order-1 md:order-1? 
                Actually for small screens we want text first, so image has order-2 by default, then at md it becomes order-1. */}
            <div
              className={`
                order-2 md:order-1
                flex justify-center transform
                transition-all duration-700 ease-out
                ${feature2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
                }}
              >
                <img
                  src={phone2}
                  alt="Feature 2"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature2InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            {/* Text second at md => order-1 md:order-2 
                means on small screens text is order-1 (first). */}
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                Lessons by a National Finalist
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Intuitive spelling lessons reduce the need for memorization with a curriculum 
                designed to focus on the patterns, rules, and tricks that govern how words are spelled.
              </p>
              {/* Feature Stats */}
              <div className="mt-8 max-w-5xl pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-stretch gap-6">
                  {/* Box 1 */}
                  <div className="flex-1 bg-[#141310] border-2 border-[#3F2F17] rounded-xl p-6 text-left">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#ffa500]">25+</h3>
                    <p className="text-gray-400 mt-2 text-sm sm:text-base md:text-lg">
                      Lessons and minilessons that teach how to spell words from 8 different languages, plus tips and tricks.
                    </p>
                  </div>
                  {/* Box 2 */}
                  <div className="flex-1 bg-[#141310] border-2 border-[#3F2F17] rounded-xl p-6 text-left">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#ffa500]">&gt; 90%</h3>
                    <p className="text-gray-400 mt-2 text-sm sm:text-base md:text-lg">
                      of spelling bee words asked in the Scripps National Spelling Bee are covered in our lessons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 3 =============== */}
        <div ref={featureRef3} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Odd Feature: text left, image right at md */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature3InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text (order-1 for small => text first) */}
            <div className="order-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                Quizzes and Official Study Lists
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Quiz yourself with carefully crafted quizzes and official study lists that give you 
                the most focused preparation, so you can spell confidently.
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Full access to the Official School Spelling Bee Study List
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm sm:text-base">
                    20+ quizzes with ~2000 words
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Practice words from 8 different languages of origin
                  </span>
                </div>
              </div>
            </div>

            {/* Image (order-2 => below text on small, right on md) */}
            <div
              className={`
                order-2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone3}
                  alt="Feature 3"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature3InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 4 =============== */}
        <div ref={featureRef4} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Even Feature: text right, image left at md 
              => use order classes so text is first on small */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature4InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Image left at md => order-2 for small, md:order-1 at md */}
            <div
              className={`
                order-2 md:order-1
                flex justify-center transform
                transition-all duration-700 ease-out
                ${feature4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
                }}
              >
                <img
                  src={phone4}
                  alt="Feature 4"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature4InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            {/* Text right at md => order-1 md:order-2 
                (and first on small screens) */}
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                In-App Blog Page with Daily Articles
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Visit The Hive blog for interesting word explanations, study help, and spelling 
                pro-tips to become a master.
              </p>
              <div className="flex flex-col space-y-2 mt-6">
                {['Daily Word of the Day', 'Weekly Articles', 'Important Announcements'].map(
                  (bullet) => (
                    <div key={bullet} className="flex items-center space-x-2">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm sm:text-base">{bullet}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 5 =============== */}
        <div ref={featureRef5} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Odd Feature: text left, image right at md */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature5InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Text (always first on small => default) */}
            <div className="order-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                Progress Tracking and Statistics
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Track your progress and use personal analytics to your advantage. 
                Get access to full quiz results, activity logs, and key statistics 
                that show how you’ve been improving.
              </p>
            </div>

            {/* Image (order-2) */}
            <div
              className={`
                order-2 flex justify-center transform
                transition-all duration-700 ease-out
                ${feature5InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
                }}
              >
                <img
                  src={phone5}
                  alt="Feature 5"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature5InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============== Feature 6 =============== */}
        <div ref={featureRef6} className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20">
          {/* Even Feature: text right, image left at md; 
              on small => text first, image second */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 items-center gap-12
              transition-opacity duration-700 delay-300
              ${feature6InView ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Image left at md => order-2 for small, md:order-1 at md */}
            <div
              className={`
                order-2 md:order-1
                flex justify-center transform
                transition-all duration-700 ease-out
                ${feature6InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <div
                className="relative rounded-3xl w-full max-w-lg h-[600px] md:h-[550px] lg:h-[700px]"
                style={{
                  background: 'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)',
                }}
              >
                <img
                  src={phone6}
                  alt="Feature 6"
                  className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    transition-all duration-700 ease-out
                    ${feature6InView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-20 delay-500'}
                  `}
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            {/* Text right at md => order-1 md:order-2 */}
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-normal">
                Real-Time Global Leaderboard
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md">
                Compete with hundreds of spellers throughout the world and rack up Honey Points 
                with every lesson and quiz.
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-10">
                What are you waiting for? Join today and begin competing and learning!
              </h3>
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
          </div>
        </div>
      </section>
    </>
  );
}
