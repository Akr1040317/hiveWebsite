export default function Contact() {
  return (
    <>
      {/* Contact Section: Simple Boxed (Updated) */}
      <div id="contact" className="bg-[#000000] dark:text-gray-100">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <div className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-500">
              Any questions?
            </div>
            <h2 className="mb-4 text-4xl font-black text-white">
              Contact Us
            </h2>
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-200 lg:w-2/3">
              If you need any further info, feel free to get in touch and we
              will get back to you as soon as possible. Thank you!
            </h3>
            <h3 className="mx-auto text-xl font-medium leading-relaxed text-gray-200 lg:w-2/3">
              Phone: 832 879 3599 || Email: aRastogi@hivespelling.com or eRastogi@hivespelling.com
            </h3>
          </div>
          {/* END Heading */}
        </div>
      </div>
      {/* END Contact Section: Simple Boxed */}
    </>
  );
}
