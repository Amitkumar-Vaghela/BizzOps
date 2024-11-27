import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
const token = localStorage.getItem('accessToken')

const PaymentTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/paid-invoice`, {headers:{'Authorization':token} ,withCredentials: true });
            setInvoices(response.data.data.paidInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const openModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };


    return (
        <div className="sm:sw-full bg-[#28282B] shadow-md rounded-lg p-6">
            <h2 className="text-base font-poppins font-semibold mb-4 text-white">Payments Records</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                    <thead className="bg-zinc-900">
                        <tr>
                            <th className="font-poppins text-white p-4">Customer Name</th>
                            <th className="font-poppins text-white p-4 text-center">Items</th>
                            <th className="font-poppins text-white p-4 text-right">Subtotal</th>
                            <th className="font-poppins text-white p-4 text-right">Grand Total</th>
                            <th className="font-poppins text-white p-4 text-center">Paid</th>
                            <th className="font-poppins text-white p-4 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <React.Fragment key={invoice._id}>
                                <tr className="odd:bg-[#28282B] even:bg-[#232325] hover:bg-[#303033]">
                                    <td className="p-4 font-poppins text-white">{invoice.name}</td>
                                    <td className="p-4 font-poppins text-white font-extralight">
                                        <table className="w-full">
                                            <thead className="bg-zinc-900">
                                                <tr>
                                                    <th className="p-2">Item Name</th>
                                                    <th className="p-2 text-right">Qty</th>
                                                    <th className="p-2 text-right">Price</th>
                                                    <th className="p-2 text-right">Tax (%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice.items.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="p-2">{item.itemName}</td>
                                                        <td className="p-2 text-right">{item.qty}</td>
                                                        <td className="p-2 text-right">₹{item.price}</td>
                                                        <td className="p-2 text-right">{item.tax}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="font-poppins text-white font-light text-sm p-4 text-right">₹{invoice.subTotal.toFixed(2)}</td>
                                    <td className="font-poppins text-white font-light text-sm p-4 text-right">₹{invoice.grandTotal.toFixed(2)}</td>
                                    <td className="font-poppins text-white font-light text-sm p-4 text-center">{invoice.paid ? <span className='text-[#1fae3b] font-poppins rounded-3xl font-medium text-xs bg-[#87ff8b] p-1'>Yes</span> : 'No'}</td>
                                    <td className="font-poppins text-white font-light text-sm p-4 text-center">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full relative">
                            <h2 className="text-lg font-poppins font-normal mb-4"># Invoice Details</h2>
                            <div>
                                <p className="text-sm font-poppins font-light mb-1"><strong>Customer Name:</strong> {selectedInvoice.name}</p>
                                <p className="text-sm font-poppins font-light mb-1"><strong>Subtotal:</strong> ₹{selectedInvoice.subTotal.toFixed(2)}</p>
                                <p className="text-sm font-poppins font-light mb-1"><strong>Date:</strong> {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                <p className="text-sm font-poppins font-light mb-1"><strong>Grand Total:</strong> ₹{selectedInvoice.grandTotal.toFixed(2)}</p>
                                <p className="text-sm font-poppins font-light mb-1 "><strong className='font-medium'>Paid:</strong> {selectedInvoice.paid ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 font-poppins text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={togglePaidStatus}
                                >
                                    {selectedInvoice.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                </button>
                                <button
                                    className="bg-gray-500 font-poppins text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentTable;