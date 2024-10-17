import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
const token = localStorage.getItem('accessToken')

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/get-invoice`, { headers:{'Authorization':token},withCredentials: true });
            setInvoices(response.data.data.invoice);
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

    const togglePaidStatus = async () => {
        if (!selectedInvoice) return;
    
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/invoices/${selectedInvoice._id}/toggle-paid`, {}, 
            { headers:{'Authorization':token},withCredentials: true });
    
            // Refresh the invoice list
            await fetchInvoices();
            closeModal();
        } catch (error) {
            console.error('Error updating paid status:', error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl bg-[#28282B] shadow-md rounded-lg p-6 overflow-x-auto">
                <h1 className="text-xl font-semibold mb-6 text-white text-center">Invoices</h1>
                <table className="w-full table-auto text-left">
                    <thead className="bg-zinc-900">
                        <tr>
                            <th className="text-white font-poppins p-4">Customer Name</th>
                            <th className="text-white font-poppins p-4 text-center">Items</th>
                            <th className="text-white font-poppins p-4 text-right">Subtotal</th>
                            <th className="text-white font-poppins p-4 text-right">Grand Total</th>
                            <th className="text-white font-poppins p-4 text-center">Paid</th>
                            <th className="text-white font-poppins p-4 text-center">Date</th>
                            <th className="text-white font-poppins p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <React.Fragment key={invoice._id}>
                                <tr className="odd:bg-[#28282B] even:bg-[#232325] hover:bg-[#303033]">
                                    <td className="p-4 text-white">{invoice.name}</td>
                                    <td className="p-4 text-white">
                                        <table className="w-full">
                                            <thead className="bg-zinc-900">
                                                <tr>
                                                    <th className="text-white p-2">Item Name</th>
                                                    <th className="text-white p-2 text-right">Qty</th>
                                                    <th className="text-white p-2 text-right">Price</th>
                                                    <th className="text-white p-2 text-right">Tax (%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice.items.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="text-white p-2">{item.itemName}</td>
                                                        <td className="text-white p-2 text-right">{item.qty}</td>
                                                        <td className="text-white p-2 text-right">₹{item.price}</td>
                                                        <td className="text-white p-2 text-right">{item.tax}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="text-white p-4 text-right">₹{invoice.subTotal.toFixed(2)}</td>
                                    <td className="text-white p-4 text-right">₹{invoice.grandTotal.toFixed(2)}</td>
                                    <td className="text-white p-4 text-center">{invoice.paid ? <span className='text-[#157428] font-poppins rounded-3xl font-medium text-xs bg-[#87ff8b] p-1 '>Yes</span> : <span className='text-[#9d1b1b] font-poppins rounded-3xl font-medium text-xs bg-[#ff6161] p-1'>No</span> }</td>
                                    <td className="text-white p-4 text-center">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            className='text-gray-600 pl-8 hover:text-gray-300 cursor-pointer'
                                            icon={faEllipsis}
                                            onClick={() => openModal(invoice)}
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-[#1d1d20] p-6 rounded-3xl shadow-lg max-w-lg sm:w-full w-4/5 relative">
                            <h2 className="text-lg font-poppins font-normal text-white mb-4"># Invoice Details</h2>
                            <div>
                                <p className="text-base text-white font-poppins font-light mb-1"><strong >Customer Name :</strong> {selectedInvoice.name}</p>
                                <p className="text-base text-white font-poppins font-light mb-1"><strong>Subtotal :</strong> ₹{selectedInvoice.subTotal.toFixed(2)}</p>
                                <p className="text-base text-white font-poppins font-light mb-1"><strong>Date :</strong> {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                <p className="text-base text-white font-poppins font-light mb-1"><strong>Grand Total :</strong> ₹{selectedInvoice.grandTotal.toFixed(2)}</p>
                                <p className="text-base text-white font-poppins font-light mb-1 "><strong className='font-medium'>Paid :</strong> {selectedInvoice.paid ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="mt-4 flex justify-end items-center gap-6">
                                <button
                                    className="text-white font-semibold font-poppins"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="text-blue-400 font-semibold hover:text-blue-300 font-poppins"
                                    onClick={togglePaidStatus}
                                >
                                    {selectedInvoice.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceTable;