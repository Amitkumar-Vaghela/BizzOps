import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function ExpenseTable() {
    const [expense, setExpense] = useState([]); 

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getExpense = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/expense/get-expense', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setExpense(response.data.data.expense); 
            }
        } catch (error) {
            console.error("Error while fetching expense", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getExpense();
    }, []);

    return (
        <div className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
            <h2 className="text-base font-poppins font-semibold mb-4 text-white">Expense Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-zinc-900">
                            <th className="px-4 py-2 text-white font-poppins">Date</th>
                            <th className="px-4 py-2 text-white font-poppins">Item</th>
                            <th className="px-4 py-2 text-white font-poppins">Amount</th>
                            <th className="px-4 py-2 text-white font-poppins">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.length > 0 ? (
                            expense.map((expense) => ( 
                                <tr key={expense._id} className="text-center">
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{formatDate(expense.date)}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{expense.name}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">₹{expense.expAmount.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{expense.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-poppins">
                                    No expense data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExpenseTable;
