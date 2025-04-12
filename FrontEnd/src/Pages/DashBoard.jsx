import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddBillModal from '../components/AddBillModal';
import BillGrid from '../components/BillGrid';

const DashBoard = () => {
    const [showAddBillModal, setShowAddBillModal] = useState(false);
    const [bills, setBills] = useState([]);

    // Load bills from local storage on component mount
    useEffect(() => {
        const storedBills = JSON.parse(localStorage.getItem('bills')) || [];
        setBills(storedBills);
    }, []);

    // Function to add a new bill
    const addBill = (newBill) => {
        const updatedBills = [...bills, newBill];
        setBills(updatedBills);
        localStorage.setItem('bills', JSON.stringify(updatedBills));
    };

    // Function to delete a bill
    const deleteBill = (id) => {
        const updatedBills = bills.filter((bill) => bill.id !== id);
        setBills(updatedBills);
        localStorage.setItem('bills', JSON.stringify(updatedBills));
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-orange-100 relative font-sans">
            <header className="w-full max-w-4xl mt-8 text-center">
                {/* <h1 className="text-3xl mb-3 font-bold text-gray-800">Dashboard</h1> */}
                {/* <p className="mt-2 text-sm text-gray-600">Manage your bills and analytics here.</p> */}
            </header>

            <BillGrid bills={bills} onDeleteBill={deleteBill} />

            <button
                className="absolute bottom-8 right-8 bg-orange-500 text-white rounded-full shadow-md p-3 hover:bg-orange-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                onClick={() => setShowAddBillModal(true)}
                aria-label="Add New Bill"
            >
                <FaPlus className="h-5 w-5" />
            </button>

            {showAddBillModal && (
                <AddBillModal
                    onClose={() => setShowAddBillModal(false)}
                    onAddBill={addBill}
                />
            )}
        </div>
    );
};

export default DashBoard;