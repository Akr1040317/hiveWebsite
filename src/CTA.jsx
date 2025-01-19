export default function CTA() {
  return (
    <>
      {/* CTA Section: Similar to Partners' styling */}
      <div className="bg-[#000000] dark:text-gray-100">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-black text-white">
              <span className="text-[#f7971e]">
                Follow us to get notified when Hive launches!
              </span>
            </h2>
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-200 lg:w-2/3">
              Follow us on Instagram and LinkedIn to be the first to know when Hive
              is available. Start spelling as soon as we launch!
            </h3>
          </div>
          {/* END Heading */}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
            <a
              href="https://www.instagram.com/hive_spelling/" 
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#f7971e] bg-[#f7971e] px-6 py-3 font-semibold leading-6 text-white hover:border-[#ffd200] hover:bg-[#ffd200] hover:text-white focus:ring focus:ring-[#ffd200]/50 active:border-[#f7971e] active:bg-[#f7971e] dark:focus:ring-[#ffd200]/90"
            >
              Follow on Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/hive-spelling/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
            >
              <span>Follow on LinkedIn</span>
              <svg
                className="hi-mini hi-arrow-right inline-block h-5 w-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          {/* END Actions */}
        </div>
      </div>
      {/* END CTA Section */}
    </>
  );
}
