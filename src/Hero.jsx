import homeImage from './assets/home.png';
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Hero() {
  return (
    <>
      {/* Hero Section: Image Side with Gradient */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 dark:text-gray-100">
        {/* Main Header */}
        <header
          id="page-header"
          className="relative flex flex-none items-center py-8"
        >
          {/* Main Header Content */}
          <div className="container mx-auto flex flex-col gap-4 px-4 text-center md:flex-row md:items-center md:justify-between md:gap-0 lg:px-8 xl:max-w-6xl">
            <div>
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-2xl font-bold tracking-wide text-black-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
              >
                <span>Hive - Spell Intelligently</span>
              </a>
            </div>
            <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:gap-0">
              <nav className="space-x-3 md:space-x-6">
                <a
                  href="#"
                  className="group relative text-sm font-semibold text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white"
                >
                  <span
                    className="absolute -inset-x-2.5 -inset-y-1.5 scale-0 rounded-xl bg-gray-100 transition ease-out group-hover:scale-100 dark:bg-gray-700/50"
                    aria-hidden="true"
                  />
                  <span className="relative">Features</span>
                </a>
                <a
                  href="#"
                  className="group relative text-sm font-semibold text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white"
                >
                  <span
                    className="absolute -inset-x-2.5 -inset-y-1.5 scale-0 rounded-xl bg-gray-100 transition ease-out group-hover:scale-100 dark:bg-gray-700/50"
                    aria-hidden="true"
                  />
                  <span className="relative">Partners</span>
                </a>
                <a
                  href="#"
                  className="group relative text-sm font-semibold text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white"
                >
                  <span
                    className="absolute -inset-x-2.5 -inset-y-1.5 scale-0 rounded-xl bg-gray-100 transition ease-out group-hover:scale-100 dark:bg-gray-700/50"
                    aria-hidden="true"
                  />
                  <span className="relative">Start</span>
                </a>
                <a
                  href="#"
                  className="group relative text-sm font-semibold text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white"
                >
                  <span
                    className="absolute -inset-x-2.5 -inset-y-1.5 scale-0 rounded-xl bg-gray-100 transition ease-out group-hover:scale-100 dark:bg-gray-700/50"
                    aria-hidden="true"
                  />
                  <span className="relative">Support</span>
                </a>
              </nav>
              <div className="mx-6 hidden h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent md:block dark:via-gray-700" />
              {/* Updated Buttons with React Router Links */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#f7971e] bg-[#f7971e] px-4 py-2 font-semibold leading-6 text-white hover:border-[#ffd200] hover:bg-[#ffd200] hover:text-white focus:ring focus:ring-[#ffd200]/50 active:border-[#f7971e] active:bg-[#f7971e] dark:focus:ring-[#ffd200]/90"
                >
                  Get Hive Free
                </Link>
              </div>
            </div>
          </div>
          {/* END Main Header Content */}
        </header>
        {/* END Main Header */}

        {/* Hero Content */}
        <div className="container relative mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-16 text-center md:grid-cols-12 md:text-left">
            <div className="md:col-span-7">
              <div>
                <h1 className="mb-4 text-4xl font-black text-black lg:text-5xl dark:text-white">
                  Spelling made simple with
                  <span className="mx-2 bg-gradient-to-b from-[#FFC801] via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Hive
                  </span>
                </h1>
                <h2 className="text-lg/relaxed font-medium text-gray-700 lg:text-xl/relaxed dark:text-gray-300">
                  Your ultimate companion for mastering spelling. With 2000 words, 12+ lessons in 8 languages, and 24 quizzes by a Scripps finalist, Hive empowers students with intuitive spelling skills.
                </h2>
              </div>
            </div>
            <div className="group relative flex items-center justify-center md:col-span-5 md:justify-end">
              <div className="absolute inset-0 rotate-45 rounded-full bg-gradient-to-b from-[#FFC801] via-yellow-400 to-yellow-600 opacity-30 blur-3xl transition group-hover:scale-95" />
              <div className="relative w-full max-w-80 origin-bottom rounded-2xl bg-white/50 p-2.5 shadow-xl shadow-teal-300/10 backdrop-blur-sm transition duration-300 group-hover:rotate-3 group-hover:scale-105 dark:bg-black/20">
                <img
                  src={homeImage}
                  alt="Promo hero"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
        {/* END Hero Content */}
      </div>
      {/* END Hero Section: Image Side with Gradient */}
    </>
  );
}
