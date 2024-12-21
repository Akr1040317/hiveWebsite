  import homeImage1 from './assets/home1.png';
  import homeImage2 from './assets/home2.png';
  import homeImage3 from './assets/home3.png';
  import appIconImage from './assets/app-icon.jpg';
  import React from 'react';
  import { Link } from 'react-router-dom';
  import { Link as ScrollLink } from 'react-scroll';  // <-- rename here

  export default function Hero() {
    return (
      <>
        <div
          className="relative overflow-hidden text-gray-100"
          style={{ backgroundColor: '#071017' }}
        >
          {/* Main Header */}
          <header
            id="page-header"
            className="relative flex flex-none items-center py-6 px-8"
          >
            <div className="container mx-auto flex items-center justify-between">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-24 px-8">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 text-2xl font-bold tracking-wide text-white hover:text-gray-400"
                >
                  <img
                    src={appIconImage}
                    alt="App Icon"
                    className="w-8 h-8"
                  />
                  <span>Hive</span>
                </a>
                <nav className="flex items-center space-x-8">
                    <Link to="home" smooth={true} duration={500} className="text-md font-medium text-[#ffa500] hover:text-white">
                    Home
                  </Link>
                  <ScrollLink to="features" smooth={true} duration={500} className="text-md font-medium text-gray-300 hover:text-white">
                  Features
                  </ScrollLink>
                  {/* <a
                    href="#about"
                    className="text-md font-medium text-gray-300 hover:text-white"
                  >
                    About
                  </a>
                  <a
                    href="#pricing"
                    className="text-md font-medium text-gray-300 hover:text-white"
                  >
                    Pricing
                  </a> */}
                  <ScrollLink to="contact" smooth={true} duration={500} className="text-md font-medium text-gray-300 hover:text-white">
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

          {/* Hero Section */}
          <div className="container relative mx-auto px-0 py-10 lg:px-0 lg:py-5 text-center">
            {/* Light Overlay Box */}
            <div
              className="relative mx-auto rounded-2xl p-10 shadow-lg backdrop-blur-md overflow-hidden"
              style={{
                backgroundColor: '#121920',
                maxWidth: 'calc(100% - 64px)',
                height: '1225px'
              }}
            >

              <p className="mb-4 mt-4 inline-block rounded-full bg-gray-700 px-4 py-4 text-sm font-medium text-gray-300">
                Conquer spelling with Hive!
              </p>
              <h1 className="mb-4 mt-6 text-4xl font-bold text-white max-w-2xl mx-auto sm:text-5xl">
                Learn to Spell
                <span className="italic text-[#ffa500]"> Intelligently </span>
              </h1>
              <h1 className="mb-10 mt-0 text-4xl font-bold text-white max-w-2xl mx-auto sm:text-5xl">
                with Hive
              </h1>
              <p className="mb-4 text-lg text-gray-400 max-w-3xl mx-auto">
                 Made by a 2022 National Spelling Bee Finalist for future champions. Master spelling with 3000+ practice words, 12+ lessons in 8 languages, 24 quizzes, and daily tips.
              </p>

              <a href="https://apps.apple.com/us/app/hive-spell-intelligently/id6479415050" target="_blank" rel="noopener noreferrer">
                <button className="mt-10 mb-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-md font-medium text-black hover:bg-gray-200">
                  <span className="mr-2"></span> Download for iOS
                </button>
              </a>



              {/* Images Section */}
              <div className="relative mt-24 flex justify-center items-center">
                {/* Left Diagonal Image */}
                <img
                  src={homeImage2}
                  alt="Lesson preview left"
                  className="absolute left-[30px] transform scale-125 rotate-[-10deg] z-0"
                  style={{ width: '420px', top: '80px' }}
                />
                {/* Center Image */}
                <img
                  src={homeImage1}
                  alt="Lesson preview center"
                  className="relative z-20 transform scale-125"
                  style={{ width: '420px' }}
                />
                {/* Right Diagonal Image */}
                <img
                  src={homeImage3}
                  alt="Lesson preview right"
                  className="absolute right-[30px] transform scale-125 rotate-[10deg] z-10"
                  style={{ width: '420px', top: '80px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
