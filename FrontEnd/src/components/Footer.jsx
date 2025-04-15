import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Assuming these modals are styled nicely with transitions
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import TermsAndConditions from '../Pages/TermsAndConditions';

// Reusable icon component for social links for cleaner code
const SocialIconLink = ({ href, srText, children }) => (
    <a
        href={href}
        className="text-gray-500 hover:text-orange-600 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-orange-500 rounded-full p-1" // Added focus ring, padding, rounding for better interaction
        target="_blank"
        rel="noreferrer"
    >
        {children}
        <span className="sr-only">{srText}</span>
    </a>
);


export default function Footer() {
    const [isOpenPrivacyPolicy, setIsOpenPrivacyPolicy] = useState(false);
    const [isOpenTermsConditions, setIsOpenTermsConditions] = useState(false);

    // Keep modal handlers as they are
    const handleOpenPrivacyPolicy = () => setIsOpenPrivacyPolicy(true);
    const handleClosePrivacyPolicy = () => setIsOpenPrivacyPolicy(false);
    const handleOpenTermsConditions = () => setIsOpenTermsConditions(true);
    const handleCloseTermsConditions = () => setIsOpenTermsConditions(false);

    // Base class for footer links for consistency
    const footerLinkClass = "text-gray-600 hover:text-orange-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-orange-400 focus:rounded-sm"; // Added focus style

    return (
        // Softer background, subtle top border
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
            {/* Conditionally render modals - ensure they have proper styling/transitions */}
            {isOpenPrivacyPolicy && <PrivacyPolicy onClose={handleClosePrivacyPolicy} />}
            {isOpenTermsConditions && <TermsAndConditions onClose={handleCloseTermsConditions} />}

            <div className="mx-auto w-full max-w-screen-xl p-6 py-8 lg:py-12"> {/* Increased padding */}
                <div className="md:flex md:justify-between mb-8"> {/* Added margin-bottom */}
                    {/* Logo Area */}
                    <div className="mb-8 md:mb-0 flex-shrink-0"> {/* Prevent shrinking on flex row */}
                        <Link to="/" className="flex items-center group">
                            <img
                                src="/logo-orange.png" // Ensure path is correct
                                className="mr-3 h-16 sm:h-20 transition-transform duration-300 ease-in-out group-hover:scale-105" // Adjusted size, added hover effect
                                alt="Billease Logo"
                            />
                             {/* Optional: Add text logo back if desired */}
                             {/* <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-800 group-hover:text-orange-600 transition-colors">BillEase</span> */}
                        </Link>
                        {/* Optional: Add a short description */}
                         <p className="mt-4 text-sm text-gray-500 max-w-xs">
                            Simplifying your bill management experience.
                         </p>
                    </div>

                    {/* Links Grid */}
                    {/* Increased gap */}
                    <div className="grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3 lg:gap-16">
                        <div>
                            {/* Styling for section headers */}
                            <h2 className="mb-6 text-sm font-semibold text-gray-800 uppercase tracking-wider">Resources</h2>
                            <ul className="space-y-4"> {/* Added vertical spacing */}
                                <li>
                                    <Link to="/" className={footerLinkClass}>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className={footerLinkClass}>
                                        About Us
                                    </Link>
                                </li>
                                 <li>
                                    <Link to="/customerDashboard" className={footerLinkClass}>
                                        Dashboard
                                    </Link>
                                </li>
                                 <li>
                                    <Link to="/contact" className={footerLinkClass}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-800 uppercase tracking-wider">Connect</h2>
                            <ul className="space-y-4">
                                <li>
                                    <a
                                        href="https://github.com/sahib-singh13" // Replace with actual project/org GitHub if available
                                        className={footerLinkClass}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Github
                                    </a>
                                </li>
                                <li>
                                    {/* Replace with actual Discord link */}
                                    <a href="https://discord.gg/yourinvite" className={footerLinkClass} target="_blank" rel="noreferrer">
                                        Discord
                                    </a>
                                </li>
                                 <li>
                                    <a href="https://linkedin.com/company/yourcompany" className={footerLinkClass} target="_blank" rel="noreferrer">
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-800 uppercase tracking-wider">Legal</h2>
                            <ul className="space-y-4">
                                <li>
                                    {/* Style button to look like a link but retain button semantics */}
                                    <button
                                        className={`${footerLinkClass} text-left w-full`} // Ensure button looks like link, aligns left
                                        onClick={handleOpenPrivacyPolicy}
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`${footerLinkClass} text-left w-full`}
                                        onClick={handleOpenTermsConditions}
                                    >
                                        Terms & Conditions
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright and Social Icons */}
                <hr className="my-6 border-gray-300 sm:mx-auto lg:my-8" /> {/* Softer divider */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center">
                        © {new Date().getFullYear()}{' '} {/* Dynamic year */}
                        <Link to="/" className="hover:text-orange-600 transition-colors duration-200">
                            BillEase™
                        </Link>
                        . All Rights Reserved.
                    </span>
                    {/* Social Icons Section */}
                    <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
                        <SocialIconLink href="https://facebook.com/yourpage" srText="Facebook page">
                           {/* Facebook Icon SVG */}
                           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19"><path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/></svg>
                        </SocialIconLink>

                         <SocialIconLink href="https://twitter.com/yourhandle" srText="Twitter page">
                           {/* Twitter Icon SVG */}
                           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17"><path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/></svg>
                        </SocialIconLink>

                        <SocialIconLink href="https://github.com/sahib-singh13" srText="GitHub account">
                            {/* GitHub Icon SVG */}
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/></svg>
                        </SocialIconLink>

                      
                        {/* <SocialIconLink href="https://discord.gg/yourinvite" srText="Discord community"> ... </SocialIconLink> */}
                        {/* <SocialIconLink href="https://youtube.com/yourchannel" srText="YouTube channel"> ... </SocialIconLink> */}

                    </div>
                </div>
            </div>
        </footer>
    );
}