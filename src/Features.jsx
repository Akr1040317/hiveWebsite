export default function Features() {
  return (
    <>
      {/* Features Section: Card Links */}
      <div id="features" className="overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-white text-white text-white">
              Discover Hive's Powerful Features
            </h2>
            <div className="mx-auto mb-3 h-1.5 w-80 rounded-lg" style={{backgroundColor: '#f7971e'}} />
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-400 lg:w-2/3 dark:text-gray-300">
              Hive is packed with features designed to make spelling easy and fun. Explore the tools and benefits that come with our app.
            </h3>
          </div>
          {/* END Heading */}

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-book relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19.5V5.75M5.25 7.5H18M5.25 12h12.75M5.25 16.5h12.75"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  Interactive Lessons & Quizzes
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  Engage in over 12+ lessons across 8 languages, and test your skills with 24 quizzes.
                </h5>
                
              </div>
            </a>

            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-chart-bar relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25v-7.5m5.25 7.5v-10.5m-10.5 10.5v-3m13.5 4.5h-15"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  AI-Powered Analytics
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  Gain insights into your progress with analytics powered by the ChatGPT API.
                </h5>
                
              </div>
            </a>

            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-trophy relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75v6.75a5.25 5.25 0 007.5 0V6.75M4.5 6.75v7.5c0 3 3 6 7.5 6s7.5-3 7.5-6v-7.5m-9 3h6"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  Competitive Points & Leaderboard
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  Compete with others and see your rank on the leaderboard.
                </h5>
                
              </div>
            </a>

            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-users relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 18.75v-1.5a2.25 2.25 0 00-2.25-2.25h-6a2.25 2.25 0 00-2.25 2.25v1.5M12 13.5a3 3 0 100-6 3 3 0 000 6zM18 8.25c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75M5 8.25c.966 0 1.75.784 1.75 1.75S5.966 11.75 5 11.75"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  Community & Posts
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  Join the community, share progress, and stay motivated with posts.
                </h5>
                
              </div>
            </a>

            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-pencil relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232a2.25 2.25 0 113.182 3.182l-7.5 7.5-4.5 1.5 1.5-4.5 7.5-7.5zM12 18.75h7.5"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  Create & Study Custom Quizzes
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  Build your own quizzes and study at your own pace.
                </h5>
                
              </div>
            </a>

            <a
              href="#"
              className="group relative rounded-xl bg-white p-4 transition duration-150 lg:p-6 dark:bg-gray-900"
            >
              <div className="absolute inset-0 scale-100 rounded-xl bg-white opacity-0 transition duration-100 group-hover:scale-105 group-hover:opacity-100 group-active:scale-100 group-active:opacity-0 dark:bg-gray-900" />
              <div className="relative text-center">
                <div className="relative mx-auto mb-8 w-12" style={{color: '#f7971e'}}>
                  <svg
                    className="hi-outline hi-clipboard-list relative inline-block size-12 transition group-hover:translate-x-1 group-hover:translate-y-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m-7 4a2.25 2.25 0 01-2.25-2.25v-12A2.25 2.25 0 018.25 3h7.5A2.25 2.25 0 0118 5.25v12A2.25 2.25 0 0115.75 19H8.25z"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 text-xl font-extrabold text-black lg:text-2xl dark:text-white">
                  Progress Tracking
                </h4>
                <h5 className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  See detailed progress and identify areas for improvement.
                </h5>
                
              </div>
            </a>
          </div>
          {/* END Features */}
        </div>
      </div>
      {/* END Features Section: Card Links */}
    </>
  );
}
