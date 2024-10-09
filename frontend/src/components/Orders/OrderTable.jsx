import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function OrderTable() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/orders/get-order', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error while fetching expense", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const toggleDoneStatus = async () => {
        if (!selectedOrder) return;
    
        try {
            await axios.put(`http://localhost:8000/api/v1/orders/order/${selectedOrder._id}/markDone`, {}, 
            { withCredentials: true });
            await getOrders();
            closeModal();
        } catch (error) {
            console.error('Error updating paid status:', error);
        }
    };

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
                            <th className="px-4 py-2 border font-font4">Date of Delivery</th>
                            <th className="px-4 py-2 border font-font4">Profit in %</th>
                            <th className="px-4 py-2 border font-font4">Sale</th>
                            <th className="px-4 py-2 border font-font4">Profit</th>
                            <th className="px-4 py-2 border font-font4">Cost</th>
                            <th className="px-4 py-2 border font-font4">Status</th>
                            <th className="px-4 py-2 border font-font4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="border-b">
                                    <td className="px-4 py-2 border text-sm font-font4">{order.item}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{order.qty}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.price}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{formatDate(order.dateToDilivery)}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{order.profitInPercent}%</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.sale}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.profit}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">₹{order.cost}</td>
                                    <td className="border p-4 text-center">{order.done ? <span className='text-green-500 font-font4 font-medium'> Delivered</span> : <span className='text-red-500 font-font4 font-medium'>Pending</span>}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            className='text-gray-600 pl-8 hover:text-gray-300 cursor-pointer'
                                            icon={faEllipsis}
                                            onClick={() => openModal(order)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-font4">
                                    No order data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full relative">
                            <h2 className="text-lg font-font4 font-normal mb-4"># Order Details</h2>
                            <div>
                                <p className="text-sm font-font4 font-light mb-1"><strong>item:</strong> {selectedOrder.item}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Qty:</strong> ₹{selectedOrder.qty}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Date of Delivery:</strong> {new Date(selectedOrder.dateToDilivery).toLocaleDateString()}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Sale:</strong> ₹{selectedOrder.sale.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Profit:</strong> ₹{selectedOrder.profit.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Cost:</strong> ₹{selectedOrder.cost.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1 "><strong className='font-medium'>Status:</strong> {selectedOrder.paid ? 'Delivered' : 'Pending'}</p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 font-font4 text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={toggleDoneStatus}
                                >
                                    {selectedOrder.done ? 'Mark as Pending' : 'Mark as Delivered'}
                                </button>
                                <button
                                    className="bg-gray-500 font-font4 text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default OrderTable;
