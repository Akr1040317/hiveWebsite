export default function FootersSimple() {
  return (
    <>
      {/* Footer Section: Simple */}
      <footer
        id="page-footer"
        className="bg-white dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="container mx-auto flex flex-col gap-6 px-4 py-16 text-center text-sm sm:flex-row-reverse sm:justify-between sm:gap-0 sm:text-left lg:px-8 lg:py-32 xl:max-w-7xl">
          <nav className="space-x-2 sm:space-x-4">
          <Link
              target="_blank"
              rel="noopener noreferrer"
              href="/termsOfService"
              className="font-medium text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Privacy Policy
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="/privacyPolicy"
              className="font-medium text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Privacy Policy
            </Link>
          </nav>
          <div className="text-gray-500 dark:text-gray-400/80">
            <span className="font-medium">Hive - Spell Intelligently</span> 
          </div>
        </div>
      </footer>
      {/* END Footer Section: Simple */}
    </>
  );
}
