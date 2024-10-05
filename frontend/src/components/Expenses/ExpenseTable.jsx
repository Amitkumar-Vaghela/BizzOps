import React, { useState } from 'react';

function ExpenseTable() {
    const [expense, setExpesne] = useState([]);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    const getExpense = async() =>{
        try {
            const response = await axios.get('http://localhost:8000/api/v1/expense/get-expense',{ withCredentials: true })
            if(response.data.statusCode === 200 ){
                console.log("expense fetched successfully");
                setExpesne(response.data.data.expense)
            }
        } catch (error) {
            console.error("Error while fetching expense", error.response?.data || error.message);
        }   
    }

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-base font-font4 font-semibold mb-4 text-gray-800">Expense Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2 border font-font4">Date</th>
                            <th className="px-4 py-2 border font-font4">Item</th>
                            <th className="px-4 py-2 border font-font4">Amount</th>
                            <th className="px-4 py-2 border font-font4">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.length > 0 ? (
                            expense.map((expense) => (
                                <tr key={sale._id} className="border-b">
                                    <td className="px-4 py-2 border text-sm font-font4">{formatDate(expense.date)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{expense.name}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{expense.expAmount.toFixed(2)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{expense.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-font4">
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