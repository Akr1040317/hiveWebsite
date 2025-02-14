import React, { useState, useRef, useEffect } from 'react';

export default function PricingSection() {
  const [billing, setBilling] = useState('monthly');

  // ====== Refs for measuring left & right card heights ======
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // This state holds the matched height for left & right cards
  const [lrHeight, setLRHeight] = useState('auto');
  const middleRef = useRef(null);
  // ====== Staggered Animations States ======
  // We'll animate these in chronological order once the section is in view
  const [sectionInView, setSectionInView] = useState(false);

  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [middleVisible, setMiddleVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  // Ref for the entire <section>, so we can observe it once
  const sectionRef = useRef(null);

  // ================== 1) Intersection Observer (for the whole section) ==================
  useEffect(() => {
    const observerOptions = { threshold: 0.2 }; 
    // triggers when 20% of the section is visible

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSectionInView(true);
      }
    }, observerOptions);

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  // ================== 2) Trigger staggered animations once section is visible ==================
  useEffect(() => {
    if (sectionInView) {
      // Title appears immediately
      setTimeout(() => setTitleVisible(true), 0);

      // Subtitle, 200ms after title
      setTimeout(() => setSubtitleVisible(true), 200);

      // Toggle, 400ms after title
      setTimeout(() => setToggleVisible(true), 400);

      // Middle card, 600ms after title
      setTimeout(() => setMiddleVisible(true), 600);

      // Left & right cards, 800ms after title (together)
      setTimeout(() => {
        setLeftVisible(true);
        setRightVisible(true);
      }, 800);
    }
  }, [sectionInView]);

  // ================== 3) Measure Left/Right Card Heights (on billing change) ==================
  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const leftHeight = leftRef.current.offsetHeight;
    const rightHeight = rightRef.current.offsetHeight;
    const maxHeight = Math.max(leftHeight, rightHeight);

    setLRHeight(`${maxHeight}px`);
  }, [billing]);

  // ================== Pricing Logic (50% off) ==================
  function getClassroomChampionPrice(b) {
    if (b === 'monthly') {
      return { newPrice: '$0.49', oldPrice: '$0.99' };
    } else if (b === 'quarterly') {
      return { newPrice: '$1.29', oldPrice: '$2.80' };
    } else if (b === 'yearly') {
      return { newPrice: '$4.69', oldPrice: '$9.99' };
    }
    return { newPrice: '$0.49', oldPrice: '$0.99' };
  }

  function getSchoolSuperstarPrice(b) {
    if (b === 'monthly') {
      return { newPrice: '$2.49', oldPrice: '$4.99' };
    } else if (b === 'quarterly') {
      return { newPrice: '$6.69', oldPrice: '$13.80' };
    } else if (b === 'yearly') {
      return { newPrice: '$23.99', oldPrice: '$49.99' };
    }
    return { newPrice: '$2.49', oldPrice: '$4.99' };
  }

  function getRegionalRulerPrice(b) {
    if (b === 'monthly') {
      return { newPrice: '$9.99', oldPrice: '$19.99' };
    } else if (b === 'quarterly') {
      return { newPrice: '$26.99', oldPrice: '$54.99' };
    } else if (b === 'yearly') {
      return { newPrice: '$95.99', oldPrice: '$199.99' };
    }
    return { newPrice: '$9.99', oldPrice: '$19.99' };
  }

  // Sliding knob for the toggle
  const sliderTransform = () => {
    switch (billing) {
      case 'monthly':
        return 'translate-x-0';
      case 'quarterly':
        return 'translate-x-[100%]';
      case 'yearly':
        return 'translate-x-[200%]';
      default:
        return 'translate-x-0';
    }
  };

  function getBillingLabel(b) {
    if (b === 'monthly') return ' per month';
    if (b === 'quarterly') return 'per quarter';
    if (b === 'yearly') return 'per year';
    return '/ user / month';
  }

  const classroom = getClassroomChampionPrice(billing);
  const superstar = getSchoolSuperstarPrice(billing);
  const ruler = getRegionalRulerPrice(billing);

  // ================== Render ==================
  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="w-full bg-black py-20 px-6 text-gray-100"
    >
      {/* --------------- TITLE --------------- */}
      <div className="max-w-7xl mx-auto text-center mb-4">
        <h2
          className={`
            text-2xl sm:text-3xl md:text-4xl font-bold mb-2
            transition-all duration-700 ease-out
            ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          50% OFF ALL PLANS UNTIL FEBRUARY 14<sup>th</sup> 🎉
        </h2>
      </div>

      {/* --------------- SUBTITLE --------------- */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <p
          className={`
            text-gray-400 max-w-2xl mx-auto
            transition-all duration-700 ease-out
            ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          Ring in the new year with exclusive content, study lists, curated lessons, quizzes, and much more!
        </p>
      </div>

      {/* --------------- TOGGLE --------------- */}
      <div
        className={`
          max-w-7xl mx-auto flex justify-center mb-10
          transition-all duration-700 ease-out
          ${toggleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}
      >
        <div className="relative inline-flex bg-gray-700 rounded-full p-1">
          <span
            className={`
              absolute top-0 left-0 w-1/3 h-full bg-white rounded-full 
              transition-transform duration-300 ease-out 
              ${sliderTransform()}
            `}
          />
          <button
            onClick={() => setBilling('monthly')}
            className={`relative z-10 text-sm px-4 py-2 rounded-full ${
              billing === 'monthly' ? 'text-black font-medium' : 'text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('quarterly')}
            className={`relative z-10 text-sm px-4 py-2 rounded-full ${
              billing === 'quarterly' ? 'text-black font-medium' : 'text-gray-300'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`relative z-10 text-sm px-4 py-2 rounded-full ${
              billing === 'yearly' ? 'text-black font-medium' : 'text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* 
        --------------- PRICING CARDS ---------------
        We use items-center so the total row height is set by the tallest item (the middle card),
        and the shorter ones are centered vertically in that row.
      */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-2">
        {/* === CLASSROOM CHAMPION (Left) === */}
        <div
          ref={leftRef}
          className={`
            w-[90%] mx-auto md:flex-1 flex flex-col bg-[#222224] p-8 rounded-xl items-center
            transition-all duration-700 ease-out
            ${leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ minHeight: lrHeight }}
        >
          <h3 className="text-lg font-semibold mb-1 text-center">Classroom Champion</h3>
          <p className="text-3xl font-bold mb-2 text-center">
            <span className="mr-3">{classroom.newPrice}</span>
            <span className="line-through text-gray-400 text-2xl">{classroom.oldPrice}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6 text-center">{getBillingLabel(billing)}</p>

          <ul className="list-disc space-y-2 mb-8 text-gray-300 pl-2 text-left">
            <li>Access to Beginnings</li>
            <li>Daily Word of the Day</li>
            <li>Weekly Announcements &amp; Articles</li>
            <li>Classroom Bee Prep</li>
            <li>Practice Words (K-5)</li>
            <li>Spelling Tips &amp; Tricks</li>
          </ul>

          <div className="mt-auto" />

          <button
            onClick={() => window.open('https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050', '_blank')}
            className="
              w-full text-center 
              text-black font-bold text-sm 
              px-6 py-3 rounded-md
              hover:opacity-90
            "
            style={{
              background: 'linear-gradient(135deg, #ffa500 30%, #f9d423 100%)',
            }}
          >
            Start 7 Day Free Trial
          </button>
        </div>

        {/* === SCHOOL SUPERSTAR (Middle) === */}
        <div
          ref={middleRef}
          className={`
            w-[90%] mx-auto md:flex-1 flex flex-col rounded-xl px-10 py-12 md:px-12 md:py-14 text-white z-10 items-center
            transition-all duration-700 ease-out
            ${middleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{
            background: 'linear-gradient(135deg, #e65c00 5%, #f9d423 100%)',
          }}
        >
          <h3 className="text-lg font-semibold mb-1 text-center">School Superstar</h3>
          <p className="text-3xl font-bold mb-2 text-center">
            <span className="mr-3">{superstar.newPrice}</span>
            <span className="line-through text-gray-200 text-2xl">{superstar.oldPrice}</span>
          </p>
          <p className="text-sm text-white/90 mb-6 text-center">{getBillingLabel(billing)}</p>

          <ul className="list-disc space-y-2 mb-8 text-white/90 pl-2 text-left">
            <li>EVERYTHING IN CLASSROOM CHAMPION +</li>
            <li>Access to Prepping for the School Bee</li>
            <li>Progress Dashboard &amp; Analytics</li>
            <li>Competitive Leaderboard</li>
            <li>Full Access to Official School Bee List</li>
            <li>Lessons &amp; Quizzes on English/Latin origins</li>
            <li>Study Tips &amp; Skills</li>
          </ul>

          <div className="mt-auto" />

          <button
            onClick={() => window.open('https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050', '_blank')}
            className="
              w-full text-center 
              bg-white text-black 
              font-medium text-sm 
              px-6 py-3 rounded-md
              hover:bg-gray-100
            "
          >
            Start 7 Day Free Trial
          </button>
        </div>

        {/* === REGIONAL RULER (Right) === */}
        <div
          ref={rightRef}
          className={`
            w-[90%] mx-auto md:flex-1 flex flex-col bg-[#222224] p-8 rounded-xl items-center
            transition-all duration-700 ease-out
            ${rightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ minHeight: lrHeight }}
        >
          <h3 className="text-lg font-semibold mb-1 text-center">Regional Ruler</h3>
          <p className="text-3xl font-bold mb-2 text-center">
            <span className="mr-3">{ruler.newPrice}</span>
            <span className="line-through text-gray-400 text-2xl">{ruler.oldPrice}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6 text-center">{getBillingLabel(billing)}</p>

          <ul className="list-disc space-y-2 mb-8 text-gray-300 pl-2 text-left">
            <li>EVERYTHING IN SCHOOL SUPERSTAR +</li>
            <li>Access to Prepping for the County/State Spelling Bee</li>
            <li>Exclusive Weekly Articles</li>
            <li>Lessons on French, Italian, Spanish, Greek, German, and Japanese origin words</li>
            <li>Practice quizzes for each of these languages</li>
          </ul>

          <div className="mt-auto" />

          <button
            onClick={() => window.open('https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050', '_blank')}
            className="
              w-full text-center
              text-black font-bold text-sm 
              px-6 py-3 rounded-md
              hover:opacity-90
            "
            style={{
              background: 'linear-gradient(135deg, #ffa500 30%, #f9d423 100%)',
            }}
          >
            Start 7 Day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
