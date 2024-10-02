import React from 'react';

function SalesTable({ sales }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-poppins mb-4 text-gray-800">Sales Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2 border font-font4">Date</th>
                            <th className="px-4 py-2 border font-font4">Product</th>
                            <th className="px-4 py-2 border font-font4">Price</th>
                            <th className="px-4 py-2 border font-font4">Quantity</th>
                            <th className="px-4 py-2 border font-font4">Total</th>
                            <th className="px-4 py-2 border font-font4">Profit</th>
                            <th className="px-4 py-2 border font-font4">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((sale) => (
                                <tr key={sale._id} className="border-b">
                                    <td className="px-4 py-2 border text-sm font-font4">{formatDate(sale.date)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{sale.productName}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{sale.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{sale.qty}</td>
                                    <td className="px-4 py-2 border font-font4 font-medium text-sm">₹{(sale.price * sale.qty).toFixed(2)}</td>
                                    <td className="px-4 py-2 border text-green-600 font-font4 text-sm font-normal">₹{sale.profit}</td>
                                    <td className="px-4 py-2 border text-red-600 font-font4 text-sm font-normal">₹{sale.cost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-font4">
                                    No sales data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesTable;