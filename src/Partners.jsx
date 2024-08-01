import merriam from './assets/merriam.png';
import chat from './assets/chat.png';
import React from 'react';

export default function Partners() {
  return (
    <>
      {/* Logos Section: Simple */}
      <div className="bg-gradient-to-tr from-indigo-100 via-purple-50 to-cyan-100 dark:from-indigo-950 dark:via-purple-950 dark:to-teal-950 dark:text-gray-100">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          <div className="mb-12 text-center">
          <div className="mb-1 text-xl font-bold uppercase tracking-wider text-[#f7971e] dark:text-[#ffd200]">
            Powered by these amazing partners
          </div>

          </div>
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2">
            <div className="flex h-32 items-center justify-center">
              <div className="inline-flex items-center gap-4 text-2xl font-semibold">
                <img
                  src= {chat} // replace with the actual path to ChatGPT logo
                  alt="ChatGPT"
                  className="h-40"
                />
                <span>ChatGPT</span>
              </div>
            </div>
            <div className="flex h-32 items-center justify-center">
              <div className="inline-flex items-center gap-4 text-2xl font-semibold">
                <img
                  src= {merriam} // replace with the actual path to Merriam-Webster logo
                  alt="Merriam-Webster"
                  className="h-40"
                />
                <span>Merriam-Webster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END Logos Section: Simple */}
    </>
  );
}
