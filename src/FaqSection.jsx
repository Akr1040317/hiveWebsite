import React, { useState, useRef, useEffect } from 'react';

export default function FaqSection() {
  // FAQ data
  const faqData = [
    {
      question: 'Is there a free trial available?',
      answer:
        'Yes, each of our plans come with a 7-day free trial, so you can comfortably decide which is best for you. If you want, we’ll provide you with a 30-minute onboarding call to get you up and running.'
    },
    {
      question: 'Can I change my plan later?',
      answer:
        'Absolutely! You can upgrade or downgrade any time through the profile view or contacting our support team.'
    },
    {
      question: 'What is your cancellation policy?',
      answer:
        'You can cancel anytime. Your subscription will remain active until the end of the current billing cycle.'
    },
    {
      question: 'Who is each plan for??',
      answer: [
        'Classroom Champion: Made for students in grades K-4 who are beginning their spelling journey. These students goals are to excel in their classroom spelling bee or ace their next spelling test.',
        'School Superstar: School Superstar is good for students in grades 4-8 whose goals are to succeed at their school spelling bee. This plan includes full access to the Official School Spelling Bee Study List.',
        'Regional Ruler: Made for students in grades 4-8 whose goals are to win their county, state, or regional spelling bee. These students are skilled spellers and have dreams of shining at the National Spelling Bee.'
      ]
    },
    ,
    {
      question: 'Why does Hive use lessons?',
      answer:
        'Hive uses lessons to take the guesswork and memorization away from spelling bee preparation. Spelling bees often use words from anywhere in the dictionary, not just the study list, so it is important to know how to spell words that you do not know. Hive lessons teach the spelling patterns behind words so you can decipher a word\'s spelling just by hearing it and knowing what language it comes from.'
    },
    {
      question: 'Why are there lessons for words from other languages?',
      answer:
        'The majority of English words are not originally English, but actually borrowed or absorbed from other languages. The language a word originally comes from is called its "language of origin," and this piece of information is hugely important to spellers. Each language of origin has its own distinct set of spelling rules and patterns, which is what Hive teaches in its lessons.'
    },
    ,
    {
      question: 'How do I use the learning tracks?',
      answer:
        'Learning tracks should be used like a curriculum, guiding students through each step of their spelling journey. Regardless of which plan you have, it is important that you start from the beginning, since the skills covered in the Beginnings learning track come in handy later on.'
    },
    {
      question: 'How often is new content added?',
      answer:
        'Words of the Day are added daily. Each week, new lessons, quizzes, and/or articles are added.'
    }
    // ... add more if you like
  ];

  // A set of open FAQ indices (allows multiple open at once, each item is independent).
  const [openItems, setOpenItems] = useState(new Set());

  // Track which item is spinning, and which animation to apply (plus->x or x->plus).
  // Example: { index: 2, animation: 'spin-to-x' }
  const [spinningItem, setSpinningItem] = useState({ index: null, animation: '' });

  // Animation state variables
  const [sectionInView, setSectionInView] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState([]);

  // Ref for the entire <section>, so we can observe it once
  const sectionRef = useRef(null);

  function handleToggle(index) {
    const newOpenSet = new Set(openItems);
    const isOpen = newOpenSet.has(index);

    if (isOpen) {
      // Closing → spin from X back to plus
      newOpenSet.delete(index);
      setSpinningItem({ index, animation: 'spin-to-plus' });
    } else {
      // Opening → spin from plus to X
      newOpenSet.add(index);
      setSpinningItem({ index, animation: 'spin-to-x' });
    }

    setOpenItems(newOpenSet);
  }

  function handleAnimationEnd() {
    // Once spin animation ends, clear the spinner so it doesn’t repeat
    setSpinningItem({ index: null, animation: '' });
  }

  // ====== Intersection Observer for the FAQ section ======
  useEffect(() => {
    const observerOptions = { threshold: 0.2 }; // triggers when 20% of the section is visible

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSectionInView(true);
        observer.disconnect(); // Stop observing after the first trigger
      }
    }, observerOptions);

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  // ====== Trigger staggered animations once section is visible ======
  useEffect(() => {
    if (sectionInView) {
      // Title appears immediately
      setTimeout(() => setTitleVisible(true), 0);

      // Subtitle, 200ms after title
      setTimeout(() => setSubtitleVisible(true), 200);

      // FAQ items, staggered 200ms apart starting 400ms after title
      faqData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleQuestions((prev) => [...prev, index]);
        }, 400 + index * 200);
      });
    }
  }, [sectionInView, faqData]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="w-full bg-black py-16 px-4 text-gray-100"
    >
      {/* Inline <style> for our keyframes and spin classes */}
      <style>
        {`
          /* Spin animations for the toggle icons */
          @keyframes rotateToX {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin-to-x {
            animation: rotateToX 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @keyframes rotateToPlus {
            0%   { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          .spin-to-plus {
            animation: rotateToPlus 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          /* Fade and slide-up animation */
          .fade-slide-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          .fade-slide-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}
      </style>

      {/* Title and Subtitle */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2
          className={`
            text-3xl md:text-4xl font-bold mb-4
            transition-all duration-700 ease-out
            ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          Your Questions, Answered
        </h2>
        <p
          className={`
            text-gray-400 mt-2
            transition-all duration-700 ease-out
            ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          Find answers to commonly asked questions about our app
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {faqData.map((faq, i) => {
  const isOpen = openItems.has(i);
  const isSpinning = spinningItem.index === i;
  const isVisible = visibleQuestions.includes(i);

  return (
    <div
      key={i}
      className={`
        w-full bg-[#1e1e1e] p-6 rounded-lg
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
      `}
    >
      {/* Question Row */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => handleToggle(i)}
      >
        <h3 className="text-lg font-semibold">
          {faq.question}
        </h3>

        {/* The icon that toggles between + and ×, plus spin classes if toggling */}
        <div
          onAnimationEnd={handleAnimationEnd}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full
            bg-[#ffac2f] text-black text-xl font-bold
            ${isSpinning ? spinningItem.animation : ''}
          `}
        >
          {isOpen ? '×' : '+'}
        </div>
      </div>

      {/* Smooth accordion: using max-height + overflow-hidden + transition */}
      <div
  className={`
    mt-4 text-gray-300 overflow-hidden
    transition-[max-height] duration-500 ease-in-out
    ${isOpen ? 'max-h-[500px] sm:max-h-96' : 'max-h-0'}
  `}
>
  {Array.isArray(faq.answer) ? (
    <ul className="list-disc pl-6 space-y-2">
      {faq.answer.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="leading-relaxed">{faq.answer}</p>
  )}
</div>

    </div>
  );
})}

      </div>
    </section>
  );
}
