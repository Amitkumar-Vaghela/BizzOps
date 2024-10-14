import React from 'react';
    
function SalesTable({ sales }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
            <h2 className="text-base font-poppins font-semibold mb-4 text-white">Sales Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-zinc-900">
                            <th className="px-4 py-2 text-white font-poppins">Date</th>
                            <th className="px-4 py-2 text-white font-poppins">Product</th>
                            <th className="px-4 py-2 text-white font-poppins">Price</th>
                            <th className="px-4 py-2 text-white font-poppins">Quantity</th>
                            <th className="px-4 py-2 text-white font-poppins">Total</th>
                            <th className="px-4 py-2 text-white font-poppins">Profit</th>
                            <th className="px-4 py-2 text-white font-poppins">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((sale) => (
                                <tr key={sale._id} className="text-center">
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{formatDate(sale.date)}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{sale.productName}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">₹{sale.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-white text-sm font-poppins">{sale.qty}</td>
                                    <td className="px-4 py-2 text-white font-poppins font-medium text-sm">₹{(sale.price * sale.qty).toFixed(2)}</td>
                                    <td className="px-4 py-2 text-[#87ff8b] font-poppins text-sm font-normal">₹ {sale.profit}</td>
                                    <td className="px-4 py-2 text-[#ff7676] font-poppins text-sm font-normal">₹ {sale.cost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-poppins">
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