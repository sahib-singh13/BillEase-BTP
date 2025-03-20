import React, { useState } from 'react';

const PrivacyPolicy = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const sections = [
    {
      title: '1. Information Collection',
      content: `BILLEASE collects:
• Personal identification (name, email, contact details)
• Transaction records and purchase history
• Device information and usage metrics
• Payment processing data (PCI-compliant services)`
    },
    {
      title: '2. Data Usage',
      content: `Your information helps us:
• Provide and improve billing management features
• Personalize user experience
• Process transactions securely
• Send service notifications
• Generate aggregated analytics`
    },
    {
      title: '3. Data Protection',
      content: `Security measures include:
• AES-256 encryption for stored data
• Regular security audits
• Two-factor authentication options
• Role-based access controls
• Secure server infrastructure`
    },
    {
      title: '4. Third-Party Sharing',
      content: `We may share data with:
• Payment processors (Stripe, PayPal)
• Cloud providers (AWS, Google Cloud)
• Legal authorities when required
• Analytics partners (Google Analytics)
Data is never sold to third-party marketers.`
    },
    {
      title: '5. User Rights',
      content: `You have the right to:
• Access personal data
• Request data correction
• Delete your account
• Export transaction history
• Opt-out of non-essential communications`
    },
    {
      title: '6. Cookies & Tracking',
      content: `We use:
• Essential session cookies
• Performance cookies
• Security tokens
• Local storage for preferences
Third-party cookies are clearly disclosed.`
    },
    {
      title: '7. Policy Updates',
      content: `Changes notified through:
• In-app banners
• Email alerts (major changes)
• Updated revision dates
Continued use implies acceptance.`
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
          BILLEASE Privacy Policy
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
              Effective Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-orange-800 mt-4 font-medium">
              Contact: 
              <a href="mailto:privacy@billease.com" className="ml-2 text-orange-600 hover:underline font-semibold">
                privacy@billease.com
              </a>
              <span className="mx-2">|</span>
              <a href="tel:+18005550199" className="text-orange-600 hover:underline font-semibold">
                +1 (800) 555-0199
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;