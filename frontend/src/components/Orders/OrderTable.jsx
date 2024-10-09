import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function OrderTable() {
    const [orders, setOrders] = useState([]); 

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/orders/get-order', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setOrders(response.data.data);
                console.log(orders);
            }
        } catch (error) {
            console.error("Error while fetching expense", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getExpense();
    }, []);

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-base font-font4 font-semibold mb-4 text-gray-800">Orders Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2 border font-font4">Item</th>
                            <th className="px-4 py-2 border font-font4">Qty</th>
                            <th className="px-4 py-2 border font-font4">Price</th>
                            <th className="px-4 py-2 border font-font4">Date to Dilivery</th>
                            <th className="px-4 py-2 border font-font4">Profit in %</th>
                            <th className="px-4 py-2 border font-font4">Sale</th>
                            <th className="px-4 py-2 border font-font4">Profit</th>
                            <th className="px-4 py-2 border font-font4">Cost</th>
                            <th className="px-4 py-2 border font-font4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => ( 
                                <tr key={order._id} className="border-b">
                                    <td className="px-4 py-2 border text-sm font-font4">{order.item}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.qty}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.price}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{formatDate(order.dateToDilivery)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.profitInPercent}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.sale}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.profit}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.cost}</td>
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

export default OrderTable;
