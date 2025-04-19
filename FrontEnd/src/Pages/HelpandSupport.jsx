// src/Pages/HelpandSupport.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import api from '../services/api'; // Use your configured Axios instance
import toast from 'react-hot-toast';

const HelpandSupport = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you today with BillEase?' } // Initial bot message
    ]);
    const [userMessage, setUserMessage] = useState('');
    const [isBotReplying, setIsBotReplying] = useState(false);
    const chatboxRef = useRef(null);

    // --- FAQs Data ---
    const faqs = [
        { question: 'What is BillEase?', answer: 'BillEase helps manage digital bills and purchase records.' },
        { question: 'How do I register?', answer: 'Click "Register" on the homepage and fill details.' },
        { question: 'Is my data secure?', answer: 'Yes, we use encryption and security measures.' },
        { question: 'How can I contact support?', answer: 'Use this chatbot or the "Contact Us" page.' },
        { question: 'What payment methods are accepted?', answer: 'Credit/debit cards and online wallets.' },
        { question: 'How do I reset my password?', answer: 'Use the "Forgot Password" link on the login page.' },
        { question: 'Can I track my spending?', answer: 'Yes, BillEase provides features for spending tracking.' },
        { question: 'How do I update my personal information?', answer: 'Log in and visit the "Personal Information" section.' },
    ];

    // Scroll chat to bottom
    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Send message and get reply
    const handleSendMessage = async () => {
        const trimmedMessage = userMessage.trim();
        if (!trimmedMessage || isBotReplying) return;

        const newUserMessage = { sender: 'user', text: trimmedMessage };
        setChatMessages(prev => [...prev, newUserMessage]);
        setUserMessage('');
        setIsBotReplying(true);

        try {
            // Call your backend endpoint which now talks to Gemini
            const response = await api.post('/chatbot/query', { message: trimmedMessage }); // Path matches backend route

            if (response.data.success) {
                const botReply = { sender: 'bot', text: response.data.reply };
                setChatMessages(prev => [...prev, botReply]);
            } else {
                throw new Error(response.data.message || "Chatbot service failed.");
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Sorry, I couldn't connect to the chatbot service right now.";
            setChatMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errorMessage}` }]);
            toast.error("Chatbot error. Please try again later.");
        } finally {
            setIsBotReplying(false);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Toggle Chat Window
     const toggleChat = () => setChatOpen(!chatOpen);

    return (
        <div className={`flex flex-col min-h-screen bg-gray-50`}>
            {/* FAQ Section */}
            <div className="w-full p-6 flex-grow container mx-auto">
                <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Help & Support</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4 max-w-4xl mx-auto">
                    {faqs.map((faq, index) => (
                        <details key={index} className="p-4 bg-white shadow rounded-lg group cursor-pointer">
                            <summary className="text-lg font-semibold text-gray-800 list-none flex justify-between items-center hover:text-orange-600 transition-colors">
                                {faq.question}
                                <span className="text-orange-500 transform transition-transform duration-200 group-open:rotate-90 ml-2 text-xl font-light">+</span>
                            </summary>
                            <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>
                 <div className="mt-10 text-center max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
                     <h2 className="text-xl font-semibold text-gray-800 mb-3">Still need help?</h2>
                     <p className="text-gray-600 mb-4">
                         Chat with our AI assistant or visit our contact page for more options.
                     </p>
                     <button
                         onClick={toggleChat}
                         className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-md inline-flex items-center transition duration-150"
                     >
                         <FaRobot className="mr-2"/> Chat Now
                     </button>
                 </div>
            </div>

            {/* Chatbot Floating Action Button (FAB) */}
            {!chatOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition hover:scale-110 active:scale-100 z-40"
                    aria-label="Open Chatbot"
                >
                    <FaRobot className="h-6 w-6" />
                </button>
            )}

            {/* Chatbot Pop-up Modal */}
            {chatOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-end sm:items-center sm:justify-center z-50 p-4 transition-opacity duration-300 ease-out">
                    <div className="bg-white w-full max-w-md h-[70vh] sm:max-h-[600px] flex flex-col rounded-lg shadow-xl overflow-hidden transition-transform duration-300 ease-out transform scale-95 sm:scale-100"> {/* Added animation */}
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-3 bg-orange-500 text-white flex-shrink-0">
                            <h2 className="text-lg font-semibold flex items-center"><FaRobot className="mr-2" /> BillEase Assistant</h2>
                            <button onClick={toggleChat} className="text-white hover:text-orange-100 p-1 rounded-full" aria-label="Close Chat" >
                                <FaTimes className="h-5 w-5"/>
                            </button>
                        </div>
                        {/* Chat Messages Area */}
                        <div ref={chatboxRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scrollbar-orange">
                            {chatMessages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} >
                                    <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${ message.sender === 'user' ? 'bg-orange-100 text-gray-800 rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none' }`} >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            {isBotReplying && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-white text-gray-500 border border-gray-200 rounded-bl-none inline-flex items-center space-x-1">
                                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Input Area */}
                        <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
                                <input type="text" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask something..." className="flex-1 p-3 border-none focus:outline-none text-sm" disabled={isBotReplying} />
                                <button onClick={handleSendMessage} className="bg-orange-500 text-white px-5 py-3 hover:bg-orange-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isBotReplying || !userMessage.trim()} >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {/* Custom Scrollbar CSS (can be global) */}
             <style jsx global>{`
                    .custom-scrollbar-orange::-webkit-scrollbar { width: 6px; height: 6px; }
                    .custom-scrollbar-orange::-webkit-scrollbar-track { background: #fff7ed; border-radius: 10px; }
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb { background: #fb923c; border-radius: 10px; border: 1px solid #fff7ed; }
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover { background: #f97316; }
                    .custom-scrollbar-orange { scrollbar-width: thin; scrollbar-color: #fb923c #fff7ed; }
                `}</style>
        </div>
    );
};

export default HelpandSupport;