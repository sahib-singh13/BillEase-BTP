import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa'; // Import an icon for the chatbot

const HelpandSupport = () => {
    const [chatOpen, setChatOpen] = useState(false); // State to toggle chatbot visibility
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    const faqs = [
        {
            question: 'What is BillEase?',
            answer: 'BillEase is a platform that helps users manage their digital bills and purchase records efficiently.',
        },
        {
            question: 'How do I register?',
            answer: 'You can register by clicking on the "Register" button on the homepage and filling out the required details.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes, we use AES-256 encryption and other security measures to ensure your data is safe.',
        },
        {
            question: 'How can I contact support?',
            answer: 'You can use the chatbot on this page or visit the "Contact Us" page for more options.',
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept various payment methods including credit/debit cards and online wallets.',
        },
        {
            question: 'How do I reset my password?',
            answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.',
        },
        {
            question: 'Can I track my spending?',
            answer: 'Yes, BillEase provides features to track your spending and manage your budget effectively.',
        },
        {
            question: 'How do I update my personal information?',
            answer: 'You can update your personal information by logging in to your account and visiting the "Profile" section.',
        },
    ];

    const handleSendMessage = () => {
        if (userMessage.trim()) {
            setChatMessages([...chatMessages, { sender: 'user', text: userMessage }]); // ... Spread operator to keep previous messages and add new user message
            setUserMessage('');
        }
    };

    return (
        <div className={`flex flex-col min-h-screen bg-gray-50 ${chatOpen ? 'overflow-hidden' : ''}`}>
            {/* FAQ Section */}
            <div className="w-full p-6">
                <h1 className="text-3xl font-bold text-orange-600 mb-6">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
                            <p className="text-gray-600 mt-2">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chatbot Icon */}
            <div
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 cursor-pointer animate-bounce"
            >
                <FaRobot className="h-6 w-6" />
            </div>

            {/* Chatbot Pop-up */}
            {chatOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[32rem] h-[40rem] p-6 rounded-lg shadow-lg relative"> {/* Increased width and height */}
                        <button
                            onClick={() => setChatOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-bold text-orange-600 mb-4">ChatBot For your help</h2>
                        <div className="flex flex-col h-[calc(100%-4rem)]"> {/* Adjusted height for content */}
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-100">
                                {chatMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 p-3 rounded-lg ${message.sender === 'user'
                                                ? 'bg-orange-200 text-right'
                                                : 'bg-gray-200 text-left'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>

                            {/* Input Box */}
                            <div className="mt-4 flex overflow-hidden">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-3 border rounded-l-lg focus:outline-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-orange-500 text-white px-4 py-3 rounded-r-lg hover:bg-orange-600"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpandSupport;