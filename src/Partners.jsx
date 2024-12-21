import merriam from './assets/merriam.png';
import chat from './assets/chat.png';
import React from 'react';

export default function Partners() {
  return (
    <>
      {/* Logos Section: Simple */}
      <div className="bg-[#071017] dark:text-gray-100">
        <div className="container mx-auto px-4 py-0 lg:px-8 lg:py-10 xl:max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-1 text-2xl font-bold uppercase tracking-wider text-white">
              Powered by these amazing partners
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2">
            <div className="flex h-32 items-center justify-center">
              <div className="inline-flex items-center gap-4 text-2xl font-semibold">
                <img
                  src={chat}
                  alt="ChatGPT"
                  className="h-40"
                />
                <span className=" text-white">ChatGPT</span>
              </div>
            </div>
            <div className="flex h-32 items-center justify-center">
              <div className="inline-flex items-center gap-4 text-2xl font-semibold">
                <img
                  src={merriam}
                  alt="Merriam-Webster"
                  className="h-40"
                />
                <span className=" text-white">Merriam-Webster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END Logos Section: Simple */}
    </>
  );
}
