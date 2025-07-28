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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/get-order`, {withCredentials: true });
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
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/order/${selectedOrder._id}/markDone`, {}, 
            { withCredentials: true });
            await getOrders();
            closeModal();
        } catch (error) {
            console.error('Error updating paid status:', error);
        }
    };

    return (
        <div className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
            <h2 className="text-base font-poppins font-semibold mb-4 text-white">Orders Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-zinc-900">
                            <th className="px-4 py-2 text-white font-poppins">Item</th>
                            <th className="px-4 py-2 text-white font-poppins">Qty</th>
                            <th className="px-4 py-2 text-white font-poppins">Price</th>
                            <th className="px-4 py-2 text-white font-poppins">Date of Delivery</th>
                            <th className="px-4 py-2 text-white font-poppins">Profit in %</th>
                            <th className="px-4 py-2 text-white font-poppins">Sale</th>
                            <th className="px-4 py-2 text-white font-poppins">Profit</th>
                            <th className="px-4 py-2 text-white font-poppins">Cost</th>
                            <th className="px-4 py-2 text-white font-poppins">Status</th>
                            <th className="px-4 py-2 text-white font-poppins">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="text-center">
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">{order.item}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">{order.qty}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">₹{order.price}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">{formatDate(order.dateToDilivery)}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">{order.profitInPercent}%</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">₹{order.sale}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">₹{order.profit}</td>
                                    <td className="px-4 py-2 text-white font-medium text-sm font-poppins">₹{order.cost}</td>
                                    <td className="p-4 font-poppins text-center">{order.done ? <span className='text-[#1fae3b] font-poppins rounded-3xl font-medium text-xs bg-[#87ff8b] p-1'> Delivered</span> : <span className='text-[#9d1b1b] font-poppins rounded-3xl font-medium text-xs bg-[#ff6161] p-1'>Pending</span>}</td>
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
                                <td colSpan="7" className="text-center px-4 py-2 border font-poppins">
                                    No order data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-[#1d1d20] p-6 rounded-3xl shadow-lg max-w-lg sm:w-full w-4/5 relative">
                            <h2 className="text-lg text-white font-poppins font-normal mb-4"># Order Details</h2>
                            <div>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>item:</strong> {selectedOrder.item}</p>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>Qty:</strong> ₹{selectedOrder.qty}</p>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>Date of Delivery:</strong> {new Date(selectedOrder.dateToDilivery).toLocaleDateString()}</p>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>Sale:</strong> ₹{selectedOrder.sale.toFixed(2)}</p>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>Profit:</strong> ₹{selectedOrder.profit.toFixed(2)}</p>
                                <p className="text-base font-poppins text-white font-light mb-1"><strong>Cost:</strong> ₹{selectedOrder.cost.toFixed(2)}</p>
                                <p className="text-base font-poppins text-white font-light mb-1 "><strong className='font-medium'>Status:</strong> {selectedOrder.paid ? 'Delivered' : 'Pending'}</p>
                            </div>
                            <div className="flex justify-end items-center gap-4 mt-4">
                                <button
                                    className="text-white font-poppins font-semibold"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="text-blue-500 font-semibold hover:text-blue-300 font-poppins"
                                    onClick={toggleDoneStatus}
                                >
                                    {selectedOrder.done ? 'Mark as Pending' : 'Mark as Delivered'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default OrderTable;
