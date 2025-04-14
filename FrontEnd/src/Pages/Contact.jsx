// src/components/Contact.js
import React, { useState, useEffect } from 'react';
import toast /* REMOVED Toaster import */ from 'react-hot-toast'; // Keep toast import
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'; // Import Icons

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // For fade-in animation

    const BACKEND_URL = `${process.env.REACT_APP_BASE_URL}/addContact`;

    useEffect(() => {
        // Trigger fade-in animation
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // --- Validation ---
        if (!name.trim()) { toast.error('Please provide your full name'); return; }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { toast.error('Please provide a valid email address'); return; } // Basic email format check
        if (!tel || !/^\d{10}$/.test(tel)) { toast.error('Please provide a valid 10-digit phone number'); return; }

        setIsSubmitting(true);
        const toastId = toast.loading('Submitting your request...');
        const formattedPhoneNumber = `+91${tel}`;

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), phoneNumber: formattedPhoneNumber })
            });
            const data = await response.json();

            if (response.ok) {
                setName(''); setEmail(''); setTel('');
                toast.success(data.message || 'Thanks for reaching out! We will contact you soon.', { id: toastId });
            } else {
                toast.error(data.message || `Error: ${response.status}`, { id: toastId });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form. Please check your connection.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Reusable Classes ---
    const inputBaseClass = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-sm placeholder-gray-400 hover:bg-gray-50/50 disabled:bg-gray-100 bg-white";
    const iconWrapperClass = "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"; // For input icons
    const infoItemClass = "flex items-start mt-6 text-gray-600"; // For contact info items
    const infoIconClass = "w-6 h-6 text-orange-500 mt-1 flex-shrink-0"; // For contact info icons
    const infoTextClass = "ml-4 text-base"; // For contact info text

    return (
        // --- Main Container with Shape Animation ---
        <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 relative">
            {/* Shape Animation Container */}
            <div className="shape-container absolute inset-0 z-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="shape bg-orange-300/40 rounded-lg" style={{ '--size': `${Math.random() * 80 + 20}px`, '--delay': `${Math.random() * -20}s`, '--duration': `${Math.random() * 15 + 15}s`, '--x-start': `${Math.random() * 100}%`, '--y-start': `${Math.random() * 100}%`, left: `var(--x-start)`, top: `var(--y-start)`, animation: `moveShape var(--duration) linear var(--delay) infinite` }}></div>
                ))}
            </div>

            {/* --- Content Wrapper --- */}
            <div className={`relative z-10 max-w-6xl mx-auto transition-opacity duration-700 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                        Contact <span className="text-orange-600">Us</span>
                    </h1>
                    <p className="mt-3 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                        Have questions or want to collaborate? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 bg-white/80 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">

                    {/* Contact Information Side */}
                    <div className="space-y-6 flex flex-col justify-center">
                        <h2 className="text-2xl text-gray-800 font-semibold">Get in touch directly:</h2>
                        <p className="text-gray-600">Find our location, phone number, and email address below.</p>
                         {/* ... Contact Info Items ... */}
                        <div className={infoItemClass}> <FaMapMarkerAlt className={infoIconClass} /> <p className={infoTextClass}><span className="font-semibold block">BillEase Headquarters</span> 123 Innovation Drive, Suite 456<br /> Tech City, ST 78910 </p> </div>
                        <div className={infoItemClass}> <FaPhoneAlt className={infoIconClass} /> <p className={infoTextClass}><span className="font-semibold block">Phone</span> +1 (555) 123-4567 </p> </div>
                        <div className={infoItemClass}> <FaEnvelope className={infoIconClass} /> <p className={infoTextClass}><span className="font-semibold block">Email</span> <a href="mailto:support@billease.com" className="hover:text-orange-600 transition-colors"> support@billease.com </a> </p> </div>

                    </div>

                    {/* Contact Form Side */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <h2 className="text-2xl text-gray-800 font-semibold mb-1">Send us a message:</h2>
                         {/* ... Form Inputs ... */}
                        <div className="relative"> <div className={iconWrapperClass}> <FaUser /> </div> <input type="text" name="name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputBaseClass} pl-12`} required disabled={isSubmitting} /> </div>
                        <div className="relative"> <div className={iconWrapperClass}> <FaEnvelope /> </div> <input type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputBaseClass} pl-12`} required disabled={isSubmitting} /> </div>
                        <div className="relative"> <div className={iconWrapperClass}> <span className="text-sm font-medium">+91</span> </div> <input type="tel" maxLength={10} name="tel" value={tel} onChange={(e) => setTel(e.target.value.replace(/\D/g, ''))} placeholder="Phone Number (10 digits)" className={`${inputBaseClass} pl-14`} required disabled={isSubmitting} /> </div>
                        {/* Submit Button */}
                        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 rounded-lg text-white font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`} > {isSubmitting ? (<span className="flex items-center justify-center"><FaSpinner className="animate-spin mr-2" /> Submitting...</span>) : ('Send Message')} </button>
                    </form>
                </div>
            </div>
            {/* REMOVED Toaster from here */}

            {/* --- Global Styles for Shape Animation --- */}
            <style jsx global>{`
                @keyframes moveShape {
                  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
                  25% { opacity: 0.8; } 50% { opacity: 0.5; } 75% { opacity: 0.9; }
                  100% { transform: translate( calc((${Math.random()} - 0.5) * 2 * 150vw), calc((${Math.random()} - 0.5) * 2 * 150vh) ) rotate(calc((${Math.random()} - 0.5) * 720deg)); opacity: 0.6; }
                }
                .shape-container { /* pointer-events: none; Optional */ }
                .shape { position: absolute; display: block; width: var(--size); height: var(--size); will-change: transform, opacity; }
            `}</style>
        </div>
    );
}