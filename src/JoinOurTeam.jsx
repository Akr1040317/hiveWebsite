import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // For the down arrow icon

const jobListings = [
  {
    id: 1,
    title: 'Marketing Design Lead',
    category: 'Marketing Positions',
    description:
      'Lead the creation of engaging content and campaigns for our social media platforms, combining creativity with strategic marketing to effectively reach our audience.',
    responsibilities: [
      'Design visually appealing social media content and marketing materials',
      'Develop and execute campaigns to boost engagement and brand growth',
      'Collaborate with the social media team to brainstorm and implement content ideas',
    ],
    qualifications: [
      'Proficiency with design tools like Canva',
      '2+ years in digital design',
      'Comprehensive digital design portfolio',
    ],
    submissions: 'Digital Design Portfolio',
    applyLink: '/apply/marketing-design-lead',
  },
  {
    id: 2,
    title: 'Social Media Manager',
    category: 'Marketing Positions',
    description:
      'Manage and monitor our social media accounts to ensure our online presence is engaging and aligns with our brand values.',
    responsibilities: [
      'Plan, schedule, and post content across platforms',
      'Engage with followers and respond to comments/messages daily',
      'Analyze social media metrics to optimize engagement strategies',
    ],
    qualifications: [
      'Familiarity with major social media platforms',
      '2+ years managing social media accounts',
      'Proven track record in growing social media presence',
    ],
    submissions: 'Social Media Management Portfolio',
    applyLink: '/apply/social-media-manager',
  },
  {
    id: 3,
    title: 'Full Stack Web Developer',
    category: 'Engineering Positions',
    description:
      'Migrate our application to a web-based platform, ensuring scalability, performance, and a seamless user experience.',
    responsibilities: [
      'Develop and maintain both front-end and back-end of the web application',
      'Ensure responsive design and optimize application for maximum speed',
      'Collaborate with designers and other developers to implement features',
    ],
    qualifications: [
      'Proficiency in JavaScript, React, and Node.js',
      '3+ years of full stack development experience',
      'Experience with database management and API integration',
    ],
    submissions: 'GitHub Repository or Project Portfolio',
    applyLink: '/apply/full-stack-web-developer',
  },
  {
    id: 4,
    title: 'Mobile App Developer',
    category: 'Engineering Positions',
    description:
      'Develop and maintain our mobile applications using Flutter, React Native, or Swift to deliver a high-quality user experience.',
    responsibilities: [
      'Build and deploy mobile applications on iOS and Android platforms',
      'Ensure the performance, quality, and responsiveness of applications',
      'Collaborate with cross-functional teams to define, design, and ship new features',
    ],
    qualifications: [
      'Fluency in Flutter, React Native, or Swift',
      '2+ years of mobile app development experience',
      'Strong understanding of mobile UI/UX design principles',
    ],
    submissions: 'App Portfolio or GitHub Repository',
    applyLink: '/apply/mobile-app-developer',
  },
];

// JobCard Component
const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isExpanded]);

  return (
    <div className="relative bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 min-h-[210px] flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <h3 className="text-2xl font-semibold text-[#ffa500]">{job.title}</h3>
        <p className="text-gray-400">{job.category}</p>
        <p className="text-gray-300 mt-4">{job.description}</p>
      </div>

      {/* Expandable Section */}
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="mt-4 overflow-hidden transition-all duration-500"
      >
        <div>
          <h4 className="text-lg font-semibold text-white mt-4 text-left">Responsibilities:</h4>
          <ul className="list-disc list-inside text-gray-300 mb-4 text-left">
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold text-white mt-4 text-left">Qualifications:</h4>
          <ul className="list-disc list-inside text-gray-300 mb-4 text-left">
            {job.qualifications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold text-white mt-4 text-left">Submissions:</h4>
          <p className="text-gray-300 mb-4 text-left">{job.submissions}</p>
          <a href={job.applyLink}>
            <button className="mt-4 bg-[#ffa500] text-black px-4 py-2 rounded-full hover:bg-[#e69500] transition-colors duration-300">
              Apply Now
            </button>
          </a>
        </div>
      </div>

      {/* Down Arrow */}
      <button
        onClick={toggleExpand}
        className="absolute bottom-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 focus:outline-none"
        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
      >
        <FiChevronDown
          size={24}
          className={`transform ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          } transition-transform duration-300`}
        />
      </button>
    </div>
  );
};

// Main JoinOurTeam Component
export default function JoinOurTeam() {
  // Split jobListings into two columns
  const leftJobs = [];
  const rightJobs = [];
  jobListings.forEach((job, index) => {
    if (index % 2 === 0) {
      leftJobs.push(job);
    } else {
      rightJobs.push(job);
    }
  });

  return (
    <section id="join-our-team" className="w-full text-gray-100 py-20 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold text-white mb-6">Join Our Team</h2>
        <p className="text-gray-400 text-lg mb-12">
          Explore our current openings below and help us build the future of spelling education.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 flex flex-col">
            {leftJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col">
            {rightJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
