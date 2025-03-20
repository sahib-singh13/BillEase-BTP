import React, { useState } from 'react';

const TermsAndConditions = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using BILLEASE ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.`
    },
    {
      title: '2. User Responsibilities',
      content: `• You must be at least 18 years old to use BILLEASE\n• You are responsible for maintaining account confidentiality\n• You agree to provide accurate billing information\n• Prohibited activities include fraud, data scraping, and system disruption`
    },
    {
      title: '3. Digital Bill Management',
      content: `• Cloud storage for digital purchase records\n• Right to remove inappropriate content\n• User retains ownership of uploaded bills\n• Maximum storage capacity: 10GB per user`
    },
    {
      title: '4. Modifications',
      content: `• We may modify Terms at any time\n• Continued use constitutes acceptance\n• Major changes notified via:\n   - Platform notifications\n   - Email alerts\n   - In-app banners`
    },
    {
      title: '5. Intellectual Property',
      content: `• BILLEASE content is proprietary\n• Trademarks include name and logo\n• User content remains user property\n• Anonymized data used for improvements`
    },
    {
      title: '6. Termination',
      content: `• Service termination with 30 days notice\n• Immediate termination for violations\n• Data retained for 90 days post-termination`
    },
    {
      title: '7. Limitation of Liability',
      content: `Not liable for:\n• Indirect/consequential damages\n• Technical failure data loss\n• Third-party service issues\n• Liability capped at 6 months' fees`
    },
    {
      title: '8. Governing Law',
      content: `• Governed by laws of [Your Country/Jurisdiction]\n• Dispute resolution via arbitration in [City]\n• Conducted in [Language]`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-orange-50 rounded-2xl shadow-xl w-full max-w-3xl p-8 relative">
        <button
          className="absolute top-6 right-6 text-orange-700 hover:text-orange-900 font-bold text-2xl"
          onClick={handleClose}
        >
          ×
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-900 border-b-2 border-orange-200 pb-4">
          BILLEASE Terms of Service
        </h2>

        <div className="h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100 p-4 bg-white rounded-lg border border-orange-100">
          {sections.map((section, index) => (
            <div key={index} className="mb-6 last:mb-0 group">
              <h3 className="text-xl font-bold text-orange-900 mb-3 px-4 py-2 bg-orange-100 rounded-lg">
                {section.title}
              </h3>
              <pre className="text-orange-800 text-justify leading-relaxed whitespace-pre-wrap font-sans bg-orange-50 p-4 rounded-lg border-l-4 border-orange-300">
                {section.content}
              </pre>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-orange-200">
            <p className="text-orange-800 text-sm font-semibold">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-orange-800 mt-4 font-medium">
              For questions: 
              <a href="mailto:support@billease.com" className="ml-2 text-orange-600 hover:underline font-semibold">
                support@billease.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;