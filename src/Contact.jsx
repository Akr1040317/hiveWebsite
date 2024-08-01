export default function Contact() {
  return (
    <>
      {/* Contact Section: Simple Boxed */}
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <div className="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <div className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
              Any questions?
            </div>
            <h2 className="mb-4 text-4xl font-black text-black dark:text-white">
              Contact Us
            </h2>
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-700 lg:w-2/3 dark:text-gray-300">
              If you need any further info, feel free to get in touch and we
              will get back to your as soon as possible.
            </h3>
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-700 lg:w-2/3 dark:text-gray-300">
              Phone: 832 879 3599 || Email: hivespelling@gmail.com || Address: 3718 SW 24th Ave, Gainesville, FL 32607
            </h3>
          </div>
          {/* END Heading */}
        </div>
      </div>
      {/* END Contact Section: Simple Boxed */}
    </>
  );
}
